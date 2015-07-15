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
              angular.forEach($scope.userGroupBulkActions, function (userGroupBulkAction) {
                if (userGroupBulkAction.selectedType.doesQualify(user, userGroupBulkAction)) {
                  promises.push(userGroupBulkAction.execute(user));
                }
              });
            });

            return $q.all(promises).then(function (userGroups) {
              var groups = [];
              angular.forEach(userGroups, function (userGroup) {
                var group = $scope.findGroupForId($scope.groups, userGroup.groupId);

                if (groups.indexOf(group) < 0) {
                  groups.push(group);
                  $scope.fetchUserGroups(group);
                }
              });

              return userGroups;
            });
          };

          $scope.bulkAction.canExecute = function () {
            var canExecute = !!$scope.userGroupBulkActions.length;
            angular.forEach($scope.userGroupBulkActions, function (userGroupBulkAction) {
              canExecute = canExecute && userGroupBulkAction.selectedType.canExecute(userGroupBulkAction);
            });

            return canExecute;
          };

          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.groups = Group.query({
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
            $scope.userGroupBulkActions.removeItem(action);
          };

          $scope.addUserGroupBulkAction = function () {
            $scope.userGroupBulkActions.push(
              new UserGroupBulkAction());
          };

          $scope.onChange = function (action) {
            var group = action.selectedGroup;
            $scope.fetchUserGroups(group);
          };
          
          //@bound: don't add anything expensive to this function!
          $scope.refreshAffectedUsers = function (userGroupBulkAction) {
            var usersAffected = [];
            
            if (!userGroupBulkAction.canExecute()) {
              return usersAffected;
            }

            angular.forEach($scope.users, function (user) {
              if (!user.checked) {
                return;
              }

              if (userGroupBulkAction.selectedType.doesQualify(user, userGroupBulkAction)) {
                usersAffected.push(user);
              }
            });
            
            return usersAffected;
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

          $scope.userGroupBulkActions = [];
          $scope.addUserGroupBulkAction();

          $scope.userGroupBulkActionTypes = userGroupBulkActionTypes;
          $scope.fetch();
        }
      };
    }
  ]);