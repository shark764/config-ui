'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'UserPermissions', 'AuthService', 'Region', '$q', 'loEvents', 'Timezone', 'PermissionGroups',
    function($scope, Session, Tenant, TenantUser, tenantTableConfig, UserPermissions, AuthService, Region, $q, loEvents, Timezone, PermissionGroups) {
      var vm = this;

      vm.loadTimezones = function() {
        $scope.timezones = Timezone.query();
      };

      vm.loadTenants = function() {
        if (UserPermissions.hasPermissionInList(PermissionGroups.accessAllTenants)) {
          //User has permission to view all tenants on the platform
          $scope.tenants = Tenant.cachedQuery({
            regionId: Session.activeRegionId
          });
        } else if (UserPermissions.hasPermission('MANAGE_TENANT')) {
          //User has permission to view and modify only the currently selected tenant
          var params = {
            id: Session.tenant.tenantId
          };

          //Set up the cache and $scope.tenants so it will be a ngResource array
          if (!Tenant.hasItem(params)) {
            Tenant.cachedGet(params);
          }

          $scope.tenants = Tenant.cachedQuery();
          $scope.tenants.$resolved = true;
        } else {
          throw new Error('Insufficient permissions to load tenantsController.');
        }

        var promise = $scope.tenants.$promise
          .then(vm.loadUsers);

        return promise;
      };

      vm.loadUsers = function(tenants) {
        $scope.users = TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return tenants;
      };

      $scope.create = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId,
          adminUserId: Session.user.id,
          parentId: Session.tenant.tenantId,
          timezone: 'US/Eastern' //Default to US-east timezone
        });
      };

      $scope.submit = function() {
        return $scope.selectedTenant.save();
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      $scope.$on('created:resource:Tenant', function(event, newTenant) {
        if (newTenant.adminUserId === Session.user.id) {
          AuthService.refreshTenants();
        }
      });

      $scope.$on('updated:resource:Tenant', function() {
        AuthService.refreshTenants();
      });

      $scope.$watch('selectedTenant', function(newVal) {
        if (newVal) {
          var result = angular.isDefined(newVal.$promise) ? newVal.$promise : newVal;
          $q.when(result).then(function(tenant) {
            tenant.$region = Region.cachedGet({
              id: tenant.regionId
            });
          });
        }
      });
      
      $scope.updateActive = function(){
        var tenantCopy = new Tenant({
          id: $scope.selectedTenant.id,
          regionId: $scope.selectedTenant.regionId,
          active: ! $scope.selectedTenant.active
        });
        
        return tenantCopy.save(function(result){
          $scope.selectedTenant.$original.active = result.active;
        });
      };

      $scope.tableConfig = tenantTableConfig(function() {
        return $scope.tenants;
      });

      vm.loadTenants();
      vm.loadTimezones();
    }
  ]);
