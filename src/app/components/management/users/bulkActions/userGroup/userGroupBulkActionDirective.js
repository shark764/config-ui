'use strict';

angular.module('liveopsConfigPanel')
  .directive('baUserGroups', ['$q', 'UserGroupBulkAction', 'userGroupBulkActionTypes', 'Group', 'TenantGroupUsers', 'Session',
    function ($q, UserGroupBulkAction, userGroupBulkActionTypes, Group, TenantGroupUsers, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '=',
          users: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/userGroup/userGroupBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.execute = function (users) {
            var promises = [];
            angular.forEach(users, function (user) {
              angular.forEach($scope.bulkAction.userGroupBulkActions, function (userGroupBulkAction) {
                if (userGroupBulkAction.selectedType.doesQualify(user, userGroupBulkAction)) {
                  promises.push(userGroupBulkAction.execute(user));
                }
              });
            });

            return $q.all(promises);
          };

          $scope.bulkAction.canExecute = function () {
            var canExecute = !!$scope.bulkAction.userGroupBulkActions.length;
            angular.forEach($scope.bulkAction.userGroupBulkActions, function (userGroupBulkAction) {
              canExecute = canExecute && userGroupBulkAction.selectedType.canExecute(userGroupBulkAction);
            });

            return canExecute;
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.bulkAction.userGroupBulkActions = [];
            $scope.addUserGroupBulkAction();
          };

          $scope.fetchGroups = function () {
            return Group.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          };

          $scope.fetchUserGroups = function (group) {
            group.members = TenantGroupUsers.query({
              tenantId: Session.tenant.tenantId,
              groupId: group.id
            });

            return group.members;
          };

          $scope.removeUserGroupBulkAction = function (action) {
            $scope.bulkAction.userGroupBulkActions.removeItem(action);
          };

          $scope.addUserGroupBulkAction = function () {
            $scope.bulkAction.userGroupBulkActions.push(
              new UserGroupBulkAction());
          };

          $scope.onChange = function (action) {
            var group = action.selectedGroup;
            if (angular.isDefined(group)){
              $scope.fetchUserGroups(group);
            }
          };

          $scope.findGroupForId = function (groups, id) {
            var foundGroup;
            angular.forEach(groups, function (group) {
              if (group.id === id) {
                foundGroup = group;
              }
            });

            return foundGroup;
          };
          
          $scope.$watch('bulkAction', function() {
            $scope.bulkAction.reset();
          });
          
          $scope.userGroupBulkActionTypes = userGroupBulkActionTypes;
        }
      };
    }
  ]);