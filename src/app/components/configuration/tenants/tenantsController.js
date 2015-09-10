'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'BulkAction', 'UserPermissions', 'AuthService', '$timeout',
    function($scope, $stateParams, $filter, Session, Tenant, TenantUser, tenantTableConfig, BulkAction, UserPermissions, AuthService, $timeout) {

      $scope.create = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId,
          adminUserId: Session.user.id
        });
      };

      $scope.fetchTenants = function() {
        if (UserPermissions.hasPermissionInList(['PLATFORM_VIEW_ALL_TENANTS', 'PLATFORM_MANAGE_ALL_TENANTS', 'PLATFORM_CREATE_ALL_TENANTS', 'PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT'])){
          return Tenant.cachedQuery({
            regionId: Session.activeRegionId
          });
        } else if (UserPermissions.hasPermission('MANAGE_TENANT')){
          return Tenant.prototype.getAsArray(Session.tenant.tenantId);
        }
      };

      $scope.fetchUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });
      
      $scope.$on('created:resource:Tenant', function(event, newTenant) {
        if (newTenant.adminUserId === Session.user.id){
          AuthService.refreshTenants();
        }
      });
      
      $scope.$on('updated:resource:Tenant', function(event, updatedTenant) {
        $timeout(AuthService.refreshTenants, 5000);
      });

      $scope.tableConfig = tenantTableConfig;

      $scope.additional = {
        fetchUsers: $scope.fetchUsers
      };

      $scope.bulkActions = {
        setTenantStatus: new BulkAction()
      };
    }
  ]);
