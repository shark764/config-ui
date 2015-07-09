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
        templateUrl: 'app/components/management/users/bulkActions/userGroupBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.execute = function (user) {
            var promises = [];
            angular.forEach($scope.userGroupBulkActions, function(userGroupBulkAction) {
              if(!userGroupBulkAction.canExecute()) {
                return;
              }
              
              if(userGroupBulkAction.selectedType.doesQualify(user, userGroupBulkAction)) {
                promises.push(userGroupBulkAction.selectedType.execute(user, userGroupBulkAction));
              }
            });
            
            return $q.all(promises).finally(function() {
              $scope.fetchUserGroups($scope.groups);
            });
          };
          
          $scope.bulkAction.canExecute = function() {
            var canExecute = !!$scope.userGroupBulkActions.length;
            angular.forEach($scope.userGroupBulkActions, function(userGroupBulkAction) {
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
            }, function(groups) {
              $scope.fetchUserGroups(groups);
            });
          };
          
          $scope.fetchUserGroups = function(groups) {
            var promises = [];
            angular.forEach(groups, function(group) {
              group.members = TenantGroupUsers.query({
                tenantId: Session.tenant.tenantId,
                groupId: group.id
              });
              
              promises.push(group.members.$promise);
            });
            
            return $q.all(promises).finally(function() {
              $scope.refreshAllAffectedUsers();
            });
          };
          
          $scope.removeUserGroupBulkAction = function(action) {
            $scope.userGroupBulkActions.removeItem(action);
          };
          
          $scope.addUserGroupBulkAction = function() {
            $scope.userGroupBulkActions.push(
              new UserGroupBulkAction());
          };
          
          $scope.refreshAffectedUsers = function(userGroupBulkAction) {
            if(!userGroupBulkAction.canExecute()) {
              return;
            }
            
            userGroupBulkAction.usersAffected = [];
            
            angular.forEach($scope.users, function(user) {
              if(!user.checked) {
                return;
              }
              
              if(userGroupBulkAction.selectedType.doesQualify(user, userGroupBulkAction)){
                userGroupBulkAction.usersAffected.push(user);
              }
            });
          };
          
          $scope.refreshAllAffectedUsers = function() {
            angular.forEach($scope.userGroupBulkActions, function(action) {
              $scope.refreshAffectedUsers(action);
            });
          };
          
          $scope.$on('table:resource:checked', $scope.refreshAllAffectedUsers);
          $scope.$on('dropdown:item:checked', $scope.refreshAllAffectedUsers);
          
          $scope.userGroupBulkActions = [];
          $scope.addUserGroupBulkAction();
          
          $scope.userGroupBulkActionTypes = userGroupBulkActionTypes;
          $scope.fetch();
        }
      };
    }
  ]);