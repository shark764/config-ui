'use strict';

angular.module('liveopsConfigPanel')
  .directive('userReasonLists', ['_', 'TenantUserReasonList', 'TenantReasonListUser', 'ReasonList', 'Session', '$timeout', '$filter', '$translate', 'Alert', '$q', 'queryCache',
    function (_, TenantUserReasonList, TenantReasonListUser, ReasonList, Session, $timeout, $filter, $translate, Alert, $q, queryCache) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userReasonLists/userReasonLists.html',
        link: function ($scope, $element) {
          var tagWrapper = angular.element(document.querySelector('#tags-inside'));

          $scope.reset = function () {
            $scope.saving = false;
            $scope.selectedReasonList = null;

            if (angular.isDefined($scope.addReasonList.name)) {
              $scope.addReasonList.name.$setUntouched();
              $scope.addReasonList.name.$setPristine();
            }

            $scope.newReasonListUser = new TenantReasonListUser({
              reasonListId: null,
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            });
          };

          $scope.save = function (selectedReasonList) {
            if (selectedReasonList === null || selectedReasonList === '') {
              return;
            }

            if (angular.isString(selectedReasonList)) {
              $scope.selectedReasonList = '';
              Alert.warning($translate.instant('reason.table.create.warning'));
              return;
            } else {
              $scope.saving = true;
              return $scope.saveUserReasonList(selectedReasonList);
            }
          };

          $scope.saveUserReasonList = function (selectedReasonList) {
            $scope.newReasonListUser.reasonListId = selectedReasonList.id;

            return $scope.newReasonListUser.$save(function (data) {
              var newUserReasonList = new TenantReasonListUser(data);
              newUserReasonList.name = selectedReasonList.name;
              newUserReasonList.id = data.reasonListId;

              // $scope.user.$reasonLists.push({
              //   id: newUserReasonList.reasonId,
              //   name: newUserReasonList.reasonName
              // });

              $scope.userReasonLists.push(newUserReasonList);

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

          $scope.remove = function (userReasonList) {


            var tgu = new TenantUserReasonList({
              userId: $scope.user.id,
              reasonListId: userReasonList.id,
              tenantId: Session.tenant.tenantId
            });

            tgu.$delete(function (tenantReasonListUser) {
              for(var reasonIndex in $scope.user.$reasons) {
                var reason = $scope.user.$reasons[reasonIndex];
                if(reason.id === tenantReasonListUser.reasonId) {
                  $scope.user.$reasons.removeItem(reason);
                  break;
                }
              }

              $scope.userReasonLists.removeItem(userReasonList);
              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              //TODO: remove once reasons api returns members list
              //Reset cache of users for this reason
              queryCache.remove('reasons/' + tgu.reasonId + '/users');
            }).then(function() {
              Alert.success($translate.instant('reason.table.remove.member'));
            });
          };

          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.userReasonLists = TenantUserReasonList.query({
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            }, $scope.reset);

            $q.all([$scope.fetchReasonLists().$promise, $scope.userReasonLists.$promise]).then(function () {

              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);
            });
          };

          $scope.fetchReasonLists = function () {
            return ReasonList.cachedQuery({
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

          $scope.filterReasonLists = function(item) {
            var matchingLists = $scope.userReasonLists.filter(function(reasonList) {
              return reasonList.id === item.id;
            });
            return matchingLists.length === 0;
          };

          $scope.removeDefaultReasons = function(item) {
            return !item.isDefault;
          };

          $scope.removeDisabledItems = function(item) {
            return item.active;
          };

          $scope.onEnter = function(){
            //Trigger the lo-submit handler that is attached to the type-ahead
            //Normally they are only triggered by click, but it does support custom events
            $element.find('type-ahead').trigger('reasons.enter.event');
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
