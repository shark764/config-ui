'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'UserPermissions', 'AuthService', 'Region', '$q',
    function($scope, $stateParams, $filter, Session, Tenant, TenantUser, tenantTableConfig, UserPermissions, AuthService, Region, $q) {

      $scope.create = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId,
          adminUserId: Session.user.id,
          parentId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenants = function() {
        if (UserPermissions.hasPermissionInList(['PLATFORM_VIEW_ALL_TENANTS', 'PLATFORM_MANAGE_ALL_TENANTS', 'PLATFORM_CREATE_ALL_TENANTS', 'PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT'])){
          return Tenant.cachedQuery({
            regionId: Session.activeRegionId
          });
        } else if (UserPermissions.hasPermission('MANAGE_TENANT')){
          var params = {
            id: Session.tenant.tenantId
          };
          
          if(!Tenant.hasItem(params)) {
            Tenant.cachedGet(params)
          }
          
          var tenants = Tenant.cachedQuery();
          tenants.$resolved = true;
          return tenants;
        }
      };

      $scope.fetchUsers = function() {
        if(!$scope.fetchTenants().$resolved) {
          return;
        }
        
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.submit = function() {
        return $scope.selectedTenant.save();
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

      $scope.$watch('selectedTenant', function(newVal){
        if (newVal){
          var result = angular.isDefined(newVal.$promise) ? newVal.$promise : newVal;
          $q.when(result).then(function(tenant){
            tenant.$region = Region.cachedGet({
              id: tenant.regionId
            });
            
            tenant.$parent = Tenant.cachedGet({
              id: Session.tenant.tenantId
            });
          });
        }
      });
      
      $scope.tableConfig = tenantTableConfig($scope.fetchTenants);
      
      $scope.Session = Session;
    }
  ]);
