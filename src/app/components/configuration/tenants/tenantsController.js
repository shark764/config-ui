'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'BulkAction', 'UserPermissions', '$q',
    function($scope, $stateParams, $filter, Session, Tenant, TenantUser, tenantTableConfig, BulkAction, UserPermissions, $q) {

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
        $scope.showBulkActions = false;
        $scope.create();
      });

      $scope.tableConfig = tenantTableConfig;

      $scope.additional = {
        fetchUsers: $scope.fetchUsers
      };

      $scope.$on('table:resource:selected', function() {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function() {
        $scope.showBulkActions = true;
      });

      $scope.bulkActions = {
        setTenantStatus: new BulkAction()
      };
    }
  ]);
