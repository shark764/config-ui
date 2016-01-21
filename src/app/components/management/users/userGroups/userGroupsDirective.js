'use strict';

angular.module('liveopsConfigPanel')
  .directive('userGroups', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', '$timeout', '$filter', '$translate', 'Alert', '$q', 'queryCache',
    function (TenantUserGroups, TenantGroupUsers, Group, Session, $timeout, $filter, $translate, Alert, $q, queryCache) {
      return {
        restrict: 'E',
        scope: {
          user: '='
        },
        templateUrl: 'app/components/management/users/userGroups/userGroups.html',
        link: function ($scope, $element) {
          var tagWrapper = angular.element(document.querySelector('#tags-inside'));

          $scope.reset = function () {
            $scope.saving = false;
            $scope.selectedGroup = null;

            if ($scope.addGroup.name) {
              $scope.addGroup.name.$setUntouched();
              $scope.addGroup.name.$setPristine();
            }

            $scope.newGroupUser = new TenantGroupUsers({
              groupId: null,
              tenantId: Session.tenant.tenantId,
              userId: $scope.user.id
            });
          };

          $scope.save = function (selectedGroup) {
            if (selectedGroup === null || selectedGroup === '') {
              return;
            }

            var promise;
            $scope.saving = true;

            if (angular.isString(selectedGroup)) {
              var group = new Group({
                name: selectedGroup,
                tenantId: Session.tenant.tenantId,
                description: '',
                active: true,
                owner: Session.user.id
              });

              promise = group.save().then(function(result){
                return $scope.saveUserGroup(result);
              }, function (response) {
                $scope.saving = false;
                return $q.reject(response);
              });
            } else {
              promise = $scope.saveUserGroup(selectedGroup);
            }

            return promise;
          };

          $scope.saveUserGroup = function (selectedGroup) {
            $scope.newGroupUser.groupId = selectedGroup.id;

            return $scope.newGroupUser.$save(function (data) {
              var newUserGroup = new TenantUserGroups(data);
              newUserGroup.groupName = selectedGroup.name;

              $scope.user.$groups.push({
                id: newUserGroup.groupId,
                name: newUserGroup.groupName
              });

              $scope.userGroups.push(newUserGroup);

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

          $scope.remove = function (userGroup) {
            var tgu = new TenantGroupUsers({
              memberId: $scope.user.id,
              groupId: userGroup.groupId,
              tenantId: userGroup.tenantId
            });

            tgu.$delete(function (tenantGroupUser) {
              for(var groupIndex in $scope.user.$groups) {
                var group = $scope.user.$groups[groupIndex];
                if(group.id === tenantGroupUser.groupId) {
                  $scope.user.$groups.removeItem(group);
                  break;
                }
              }

              $scope.userGroups.removeItem(userGroup);
              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              //TODO: remove once groups api returns members list
              //Reset cache of users for this group
              queryCache.remove('groups/' + tgu.groupId + '/users');
            }).then(function() {
              Alert.success($translate.instant('group.table.remove.member'));
            });
          };

          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.userGroups = TenantUserGroups.query({
              tenantId: Session.tenant.tenantId,
              memberId: $scope.user.id
            }, $scope.reset);

            $q.all([$scope.fetchGroups().$promise, $scope.userGroups.$promise]).then(function () {

              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);
            });
          };

          $scope.fetchGroups = function () {
            return Group.cachedQuery({
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

          $scope.filterGroups = function(item) {
            var matchingGroups = $filter('filter')($scope.userGroups, {
              'groupId': item.id
            }, true);

            return matchingGroups.length === 0;
          };
          
          $scope.onEnter = function(){
            //Trigger the lo-submit handler that is attached to the type-ahead
            //Normally they are only triggered by click, but it does support custom events
            $element.find('type-ahead').trigger('groups.enter.event');
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
