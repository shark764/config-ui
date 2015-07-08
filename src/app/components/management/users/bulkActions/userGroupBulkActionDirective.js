'use strict';

angular.module('liveopsConfigPanel')
  .directive('baUserGroups', ['$q', 'userGroupBulkActionTypes', 'Group', 'TenantGroupUsers', 'Session',
    function ($q, userGroupBulkActionTypes, Group, TenantGroupUsers, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/userGroupBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.action = function (user) {
            var promises = [];
            angular.forEach($scope.userGroupBulkActions, function(userGroupBulkAction) {
              if(!userGroupBulkAction.selectedGroup || !userGroupBulkAction.selectedType) {
                return;
              }
              
              if(userGroupBulkAction.selectedType === 'add') {
                var tenantGroupUser = new TenantGroupUsers();
                tenantGroupUser.userId = user.id;
                
                promises.push(tenantGroupUser.$save({
                  groupId: userGroupBulkAction.selectedGroup,
                  tenantId: Session.tenant.tenantId
                }));
              } else if (userGroupBulkAction.selectedType === 'remove') {
                var tenantGroupUser = new TenantGroupUsers();
                promises.push(tenantGroupUser.$delete({
                  groupId: userGroupBulkAction.selectedGroup,
                  tenantId: Session.tenant.tenantId,
                  memberId: user.id
                }));
              }
            });
            
            return $q.all(promises);
          };
          
          $scope.fetch = function () {
            if (!Session.tenant.tenantId) {
              return;
            }

            $scope.groups = Group.query({
              tenantId: Session.tenant.tenantId
            });
          };
          
          $scope.removeUserGroupBulkAction = function(action) {
            $scope.userGroupBulkActions.removeItem(action);
          };
          
          $scope.addUserGroupBulkAction = function() {
            $scope.userGroupBulkActions.push({
              selectedType: userGroupBulkActionTypes[0]
            });
          };
          
          $scope.userGroupBulkActions = [];
          $scope.addUserGroupBulkAction();
          
          $scope.userGroupBulkActionTypes = userGroupBulkActionTypes;
          $scope.fetch();
        }
      };
    }
  ]);