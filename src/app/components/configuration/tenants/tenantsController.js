'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'BulkAction', 'UserPermissions', 'AuthService', 'Region', '$q',
    function($scope, $stateParams, $filter, Session, Tenant, TenantUser, tenantTableConfig, BulkAction, UserPermissions, AuthService, Region, $q) {

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
      
      $scope.$on('updated:resource:Tenant', function() {
        AuthService.refreshTenants();
      });

      $scope.tableConfig = tenantTableConfig;

      $scope.bulkActions = {
        setTenantStatus: new BulkAction()
      };
      
      $scope.$watch('selectedTenant', function(newVal){
        if (newVal){
          $q.when(newVal).then(function(tenant){
            tenant.region = Region.cachedGet({
              id: tenant.regionId
            });
          });
        }
      });
      
      $scope.submit = function() {
        return $scope.selectedTenant.save();
      };
    }
  ]);
