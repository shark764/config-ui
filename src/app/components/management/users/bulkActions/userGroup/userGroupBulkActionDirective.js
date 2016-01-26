'use strict';

angular.module('liveopsConfigPanel')
  .directive('baUserGroups', ['$q', 'UserGroupBulkAction', 'userGroupBulkActionTypes', 'Group', 'TenantGroupUsers', 'Session', 'BulkAction',
    function($q, UserGroupBulkAction, userGroupBulkActionTypes, Group, TenantGroupUsers, Session, BulkAction) {
      return {
        restrict: 'E',
        require: '?^bulkActionExecutor',
        scope: {
          users: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/userGroup/userGroupBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.execute = function(users) {
            var promises = [];
            angular.forEach(users, function(user) {
              angular.forEach($scope.bulkAction.userGroupBulkActions, function(userGroupBulkAction) {
                if (userGroupBulkAction.selectedType.doesQualify(user, userGroupBulkAction)) {
                  promises.push(userGroupBulkAction.execute(user));
                }
              });
            });

            return $q.all(promises);
          };

          $scope.bulkAction.canExecute = function() {
            var canExecute = !!$scope.bulkAction.userGroupBulkActions.length;
            angular.forEach($scope.bulkAction.userGroupBulkActions, function(userGroupBulkAction) {
              canExecute = canExecute && userGroupBulkAction.selectedType.canExecute(userGroupBulkAction);
            });

            return canExecute;
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.bulkAction.userGroupBulkActions = [];
            $scope.addUserGroupBulkAction();
          };

          $scope.fetchGroups = function() {
            $scope.availableGroups = [];

            if ($scope.currSelectedType === 'remove') {
              angular.forEach($scope.users, function(user) {
                if (user.checked) {
                  angular.forEach(user.$groups, function(group) {
                    $q.when(Group.cachedGet({
                      id: group.id,
                      tenantId: Session.tenant.tenantId
                    }), function(fullGroup) {
                      if ($scope.availableGroups.length === 0) {
                        $scope.availableGroups.push(fullGroup);
                      } else {
                        // Checks if the current user group is already in the list, if it is, we skip.  If not we add it to the list.
                        if ($scope.availableGroups.map(function(e) {
                            return e.id;
                          }).indexOf(fullGroup.id) < 0) {
                          $scope.availableGroups.push(fullGroup);
                        }
                      }
                    });
                  });
                }
              });
            } else {

              $scope.availableGroups = Group.cachedQuery({
                tenantId: Session.tenant.tenantId
              });
            }
          };

          $scope.removeUserGroupBulkAction = function(action) {
            $scope.bulkAction.userGroupBulkActions.removeItem(action);
          };

          $scope.addUserGroupBulkAction = function() {
            $scope.bulkAction.userGroupBulkActions.push(
              new UserGroupBulkAction());
          };

          $scope.onTypeChange = function(action) {
            $scope.currSelectedType = action.selectedType.value;
            $scope.fetchGroups();
          };

          $scope.$watch('bulkAction', function() {
            $scope.bulkAction.reset();
          });

          $scope.$on('table:resource:checked', function() {
            $scope.fetchGroups();
          });

          $scope.userGroupBulkActionTypes = userGroupBulkActionTypes;
          $scope.fetchGroups();
        }
      };
    }
  ]);
