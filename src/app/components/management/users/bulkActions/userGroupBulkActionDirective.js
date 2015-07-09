'use strict';

angular.module('liveopsConfigPanel')
  .directive('baUserGroups', ['$q', 'userGroupBulkActionTypes', 'Group', 'TenantGroupUsers', 'Session',
    function ($q, userGroupBulkActionTypes, Group, TenantGroupUsers, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '=',
          users: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/userGroupBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.action = function (user) {
            var promises = [];
            angular.forEach($scope.userGroupBulkActions, function(userGroupBulkAction) {
              if(!userGroupBulkAction.selectedGroup || !userGroupBulkAction.selectedType) {
                return;
              }
              
              if(userGroupBulkAction.selectedType.doesQualify(user, 
                userGroupBulkAction.selectedGroup)) {
                  
                promises.push(userGroupBulkAction.selectedType.execute(user,
                  userGroupBulkAction.selectedGroup));
              }
            });
            
            return $q.all(promises).finally(function() {
              $scope.fetchUserGroups($scope.groups);
            });
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
          }
          
          $scope.removeUserGroupBulkAction = function(action) {
            $scope.userGroupBulkActions.removeItem(action);
          };
          
          $scope.addUserGroupBulkAction = function() {
            $scope.userGroupBulkActions.push({
              selectedType: userGroupBulkActionTypes[0],
              usersAffected: []
            });
          };
          
          $scope.refreshAffectedUsers = function(userGroupBulkAction) {
            if(!userGroupBulkAction.selectedGroup || !userGroupBulkAction.selectedType) {
              return;
            }
            
            userGroupBulkAction.usersAffected = [];
            
            angular.forEach($scope.users, function(user) {
              if(!user.checked) {
                return;
              }
              
              if(userGroupBulkAction.selectedType.doesQualify(user, 
                userGroupBulkAction.selectedGroup)){
                  
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