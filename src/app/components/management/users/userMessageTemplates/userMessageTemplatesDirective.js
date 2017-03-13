'use strict';

angular.module('liveopsConfigPanel')
.directive('userMessageTemplates', ['_', 'TenantUserMessageTemplate', 'TenantMessageTemplateUser', 'MessageTemplate', 'Session', '$timeout', '$filter', '$translate', 'Alert', '$q', 'queryCache',
  function (_, TenantUserMessageTemplate, TenantMessageTemplateUser, MessageTemplate, Session, $timeout, $filter, $translate, Alert, $q, queryCache) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userMessageTemplates/userMessageTemplates.html',
        link: function ($scope, $element) {
          var tagWrapper = angular.element(document.querySelector('#tags-inside-message-templates'));

          $scope.reset = function () {
            $scope.saving = false;
            $scope.selectedMessageTemplate = null;

            if (angular.isDefined($scope.addMessageTemplate.name)) {
              $scope.addMessageTemplate.name.$setUntouched();
              $scope.addMessageTemplate.name.$setPristine();
            }

            $scope.newMessageTemplateUser = new TenantMessageTemplateUser({
              messageTemplateId: null,
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            });
          };

          $scope.save = function (selectedMessageTemplate) {
            if (selectedMessageTemplate === null || selectedMessageTemplate === '') {
              return;
            }

            var promise;
            $scope.saving = true;

            if (angular.isString(selectedMessageTemplate)) {
              var messageTemplate = new MessageTemplate({
                name: selectedMessageTemplate,
                tenantId: Session.tenant.tenantId,
                description: '',
                active: true,
                shared: false
              });

              promise = messageTemplate.save().then(function(result){
                return $scope.saveUserMessageTemplate(result);
              }, function (response) {
                $scope.saving = false;
                if (response.status === 400) {
                  $scope.reset();
                  return Alert.warning($translate.instant('messageTemplate.add.failure'));
                } else {
                  return $q.reject(response);
                }
              });
            } else {
              promise = $scope.saveUserMessageTemplate(selectedMessageTemplate);
            }

            return promise;
          };

          $scope.saveUserMessageTemplate = function (selectedMessageTemplate) {
            $scope.newMessageTemplateUser.messageTemplateId = selectedMessageTemplate.id;

            return $scope.newMessageTemplateUser.$save(function (data) {
              var newUserMessageTemplate = new TenantMessageTemplateUser(data);
              newUserMessageTemplate.name = selectedMessageTemplate.name;
              newUserMessageTemplate.id = data.messageTemplateId;
              $scope.userMessageTemplates.push(newUserMessageTemplate);

              $timeout(function () { //Timeout prevents simultaneous $digest cycles
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              $scope.reset();
              return data;
            }, function (response) {
              $scope.saving = false;
              return $q.reject(response);
            });
          };

          $scope.remove = function (userMessageTemplate) {
            var tgu = new TenantUserMessageTemplate({
              userId: $scope.user.id,
              messageTemplateId: userMessageTemplate.id,
              tenantId: Session.tenant.tenantId
            });


            tgu.$delete(function (TenantMessageTemplateUser) {

              for(var messageIndex in $scope.user.$messages) {
                var message = $scope.user.$messages[messageIndex];
                if(message.id === TenantMessageTemplateUser.messageId) {
                  $scope.user.$messages.removeItem(message);
                  break;
                }
              }

              $scope.userMessageTemplates.removeItem(userMessageTemplate);
              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              //TODO: remove once messages api returns members list
              //Reset cache of users for this message
              queryCache.remove('messages/' + tgu.messageId + '/users');
            }).then(function() {
              Alert.success($translate.instant('messageTemplate.removal.success'));
            });
          };

          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.userMessageTemplates = TenantUserMessageTemplate.query({
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            }, $scope.reset);

            $q.all([$scope.fetchMessageTemplates().$promise, $scope.userMessageTemplates.$promise]).then(function () {

              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);
            });
          };

          $scope.fetchMessageTemplates = function () {
            return MessageTemplate.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };

          $scope.$watch('user', function (newSelection) {
            if (!newSelection || !Session.tenant.tenantId) {
              return;
            }

            $scope.reset();
            $scope.fetch();
          });

          $scope.filterMessageTemplates = function(item) {
            var matchingLists = $scope.userMessageTemplates.filter(function(messageTemplate) {
              return messageTemplate.id === item.id;
            });
            return matchingLists.length === 0;
          };

          $scope.removeDefaultMessages = function(item) {
            return !item.isDefault;
          };

          $scope.removeDisabledItems = function(item) {
            return item.active;
          };

          $scope.onEnter = function(){
            //Trigger the lo-submit handler that is attached to the type-ahead
            //Normally they are only triggered by click, but it does support custom events
            $element.find('type-ahead').trigger('messages.enter.event');
          };

          //This is just for presentation, to only show the expander thing when there is more than three rows of data
          $scope.collapsed = true;
          $scope.hideCollapseControls = true;

          $scope.$on('resizehandle:resize', function () {
            $scope.updateCollapseState(tagWrapper.height());
          });

          $scope.updateCollapseState = function (wrapperHeight) {
            var maxCollapsedHeight = 94; //TODO: This should be dynamically determined
            if (wrapperHeight < maxCollapsedHeight && wrapperHeight > 0) {
              $scope.$apply(function () {
                $scope.hideCollapseControls = true;
              });
            } else {
              $scope.$apply(function () {
                $scope.hideCollapseControls = false;
              });
            }
          };
        }
      };
    }
  ]);
