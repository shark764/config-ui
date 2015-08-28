'use strict';

angular.module('liveopsConfigPanel')
  .directive('rolePermissions', ['TenantPermission', '$filter', '$q', 'Session', function (TenantPermission, $filter, $q, Session) {
      return {
        restrict: 'E',
        scope: {
          role: '='
        },
        templateUrl: 'app/components/management/roles/rolePermissions/rolePermissions.html',
        link: function ($scope) {
          $scope.rolePermissions = [];
          
          $scope.save = function () {
            if (! $scope.selectedPermission) {
              return;
            }
            
            $scope.filtered.removeItem($scope.selectedPermission);
            $scope.role.permissions.push(angular.copy($scope.selectedPermission.id));
            $scope.rolePermissions.push(angular.copy($scope.selectedPermission));
            $scope.selectedPermission = null;
            
            
            if (! $scope.role.isNew()){
              $scope.role.$update();
            }
          };
          
          $scope.fetchPermissions = function(){
            return TenantPermission.cachedQuery({
              tenantId: Session.tenant.tenantId
            });
          }
          
          $scope.fetchRolePermissions = function(){
            $scope.rolePermissions.length = 0;
            if ($scope.role){
              angular.forEach($scope.role.permissions, function(permissionId){
                $scope.rolePermissions.push(TenantPermission.cachedGet({id: permissionId, tenantId: Session.tenant.tenantId}));
              });
            }
            
            return $scope.rolePermissions;
          }
          
          $scope.updateFiltered = function () {
            $scope.filtered = $filter('objectNegation')($scope.fetchPermissions(), 'id', $scope.rolePermissions, 'id');
          };
          
          $scope.$watch('role', function(){
            $scope.fetchPermissions().$promise.then(function(){
              $scope.fetchRolePermissions();
              $q.all($scope.rolePermissions).then(function(){
                $scope.updateFiltered();
              });
            });
          });
        }
      };
    }
  ]);
