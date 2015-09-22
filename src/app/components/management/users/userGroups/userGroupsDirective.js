'use strict';

/*jshint browser:true */

angular.module('liveopsConfigPanel')
  .directive('userGroups', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', '$timeout', '$filter', 'Alert', '$q', 'queryCache',
    function (TenantUserGroups, TenantGroupUsers, Group, Session, $timeout, $filter, Alert, $q, queryCache) {
      return {
        restrict: 'E',

        scope: {
          user: '='
        },

        templateUrl: 'app/components/management/users/userGroups/userGroups.html',

        link: function ($scope) {
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

          $scope.save = function () {
            if ($scope.selectedGroup === null) {
              return;
            }

            $scope.saving = true;

            if (!$scope.selectedGroup.id) {
              $scope.createGroup($scope.selectedGroup.name,
                $scope.saveUserGroup,
                function () {
                  $scope.saving = false;
                  Alert.error('Failed to create a new group');
                }
              );
            } else {
              $scope.filtered.removeItem($scope.selectedGroup);
              $scope.saveUserGroup();
            }
          };

          $scope.createGroup = function (groupName, onComplete, onError) {
            new Group({
              name: groupName,
              tenantId: Session.tenant.tenantId,
              description: '',
              active: true,
              owner: Session.user.id
            }).save(function (result) {
              $scope.selectedGroup = result;
              if (typeof onComplete !== 'undefined' && onComplete !== null) {
                onComplete();
              }
            }, function () {
              if (typeof onError !== 'undefined' && onError !== null) {
                onError();
              }
            });
          };

          $scope.saveUserGroup = function () {
            $scope.newGroupUser.groupId = $scope.selectedGroup.id;

            $scope.newGroupUser.$save(function (data) {
              var newUserGroup = new TenantUserGroups(data);
              newUserGroup.groupName = $scope.selectedGroup.name;

              $scope.user.groups.push({
                id: newUserGroup.groupId,
                name: newUserGroup.groupName
              });

              $scope.userGroups.push(newUserGroup);
              $scope.updateFiltered();
              
              //TODO: remove once groups api returns members list
              //Reset cache of users for this group
              queryCache.remove('groups/' + $scope.selectedGroup.id + '/users');

              $timeout(function () { //Timeout prevents simultaneous $digest cycles
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);

              $scope.reset();
            }, function () {
              Alert.error('Failed to save user group');
              $scope.saving = false;
            });
          };

          $scope.remove = function (userGroup) {
            var tgu = new TenantGroupUsers({
              memberId: $scope.user.id,
              groupId: userGroup.groupId,
              tenantId: userGroup.tenantId
            });

            tgu.$delete(function (tenantGroupUser) {
              for(var groupIndex in $scope.user.groups) {
                var group = $scope.user.groups[groupIndex];
                if(group.id === tenantGroupUser.groupId) {
                  $scope.user.groups.removeItem(group);
                  break;
                }
              }

              $scope.userGroups.removeItem(userGroup);
              $scope.updateFiltered();
              $timeout(function () {
                $scope.updateCollapseState(tagWrapper.height());
              }, 200);
              
              //TODO: remove once groups api returns members list
              //Reset cache of users for this group
              queryCache.remove('groups/' + tgu.groupId + '/users');
            });
          };

          $scope.updateFiltered = function () {
            $scope.filtered = $filter('objectNegation')($scope.fetchGroups(), 'id', $scope.userGroups, 'groupId');
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

              $scope.updateFiltered();

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

          //This is just for presentation, to only show the expander thing when there is more than three rows of data
          $scope.collapsed = true;
          $scope.hideCollapseControls = true;

          var tagWrapper = angular.element(document.querySelector('#tags-inside'));
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
