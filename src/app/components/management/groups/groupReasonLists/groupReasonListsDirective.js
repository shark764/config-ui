'use strict';

angular.module('liveopsConfigPanel')
  .directive('groupReasonLists', ['_', 'TenantGroupReasonList', 'TenantReasonListGroup', 'ReasonList', 'Session', '$timeout', '$filter', '$translate', 'Alert', '$q', 'queryCache',
    function (_, TenantGroupReasonList, TenantReasonListGroup, ReasonList, Session, $timeout, $filter, $translate, Alert, $q, queryCache) {
      return {
        restrict: 'E',
        scope: {
          group: '='
        },
        templateUrl: 'app/components/management/groups/groupReasonLists/groupReasonLists.html',
        link: function ($scope, $element) {
          var tagWrapper = angular.element(document.querySelector('#tags-inside'));

          $scope.reset = function () {
            $scope.saving = false;
            $scope.selectedReasonList = null;

            if (angular.isDefined($scope.addReasonList.name)) {
              $scope.addReasonList.name.$setUntouched();
              $scope.addReasonList.name.$setPristine();
            }

            $scope.newReasonListGroup = new TenantReasonListGroup({
              reasonListId: null,
              tenantId: Session.tenant.tenantId,
              groupId: $scope.group.id
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
              return $scope.saveGroupReasonList(selectedReasonList);
            }
          };

          $scope.saveGroupReasonList = function (selectedReasonList) {
            $scope.newReasonListGroup.reasonListId = selectedReasonList.id;

            return $scope.newReasonListGroup.$save(function (data) {
              var newGroupReasonList = new TenantReasonListGroup(data);
              newGroupReasonList.name = selectedReasonList.name;
              newGroupReasonList.id = data.reasonListId;

              // $scope.group.$reasonLists.push({
              //   id: newGroupReasonList.reasonId,
              //   name: newGroupReasonList.reasonName
              // });

              $scope.groupReasonLists.push(newGroupReasonList);

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

          $scope.remove = function (groupReasonList) {
            var tgu = new TenantGroupReasonList({
              groupId: $scope.group.id,
              reasonListId: groupReasonList.id,
              tenantId: groupReasonList.tenantId
            });

            tgu.$delete(function (tenantReasonListGroup) {
              for(var reasonIndex in $scope.group.$reasons) {
                var reason = $scope.group.$reasons[reasonIndex];
                if(reason.id === tenantReasonListGroup.reasonId) {
                  $scope.group.$reasons.removeItem(reason);
                  break;
                }
              }

              $scope.groupReasonLists.removeItem(groupReasonList);
              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              //TODO: remove once reasons api returns members list
              //Reset cache of groups for this reason
              queryCache.remove('reasons/' + tgu.reasonId + '/groups');
            }).then(function() {
              Alert.success($translate.instant('reason.table.remove.member'));
            });
          };

          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.groupReasonLists = TenantGroupReasonList.query({
              tenantId: Session.tenant.tenantId,
              groupId: $scope.group.id
            }, $scope.reset);

            $q.all([
              $scope.fetchReasonLists().$promise, $scope.groupReasonLists.$promise
            ]).then(function () {

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

          $scope.$watch('group', function (newSelection) {
            if (!newSelection || !Session.tenant.tenantId) {
              return;
            }

            $scope.reset();
            $scope.fetch();
          });

          $scope.filterReasonLists = function(item) {
            var matchingLists = [];

            if ($scope.groupReasonLists) {
              matchingLists = $scope.groupReasonLists.filter(function(reasonList) {
                return reasonList.id === item.id;
              });
            }

            return matchingLists.length === 0;
          };

          $scope.removeDefaultReasons = function(item) {
            return !item.isDefault && item.active === true;
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
