'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'UserPermissions', 'AuthService', 'Region', '$q', 'lodash', 'loEvents',
    function ($scope, Session, Tenant, TenantUser, tenantTableConfig, UserPermissions, AuthService, Region, $q, _, loEvents) {
      var vm = this;

      vm.loadTenants = function () {
        if (UserPermissions.hasPermissionInList(['PLATFORM_VIEW_ALL_TENANTS', 'PLATFORM_MANAGE_ALL_TENANTS', 'PLATFORM_CREATE_ALL_TENANTS', 'PLATFORM_CREATE_TENANT_ROLES', 'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT'])) {
          $scope.tenants = Tenant.cachedQuery({
            regionId: Session.activeRegionId
          });
        } else if (UserPermissions.hasPermission('MANAGE_TENANT')) {
          var params = {
            id: Session.tenant.tenantId
          };

          if (!Tenant.hasItem(params)) {
            Tenant.cachedGet(params);
          }

          $scope.tenants = Tenant.cachedQuery();
          $scope.tenants.$resolved = true;
        } else {
          throw new Error('Insufficient permissions to load tenantsController.');
        }

        var promise = $scope.tenants.$promise
          .then(vm.loadUsers)
          .then(vm.associateParents);

        return promise;
      };

      vm.loadUsers = function (tenants) {
        $scope.users = TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return tenants;
      };

      vm.associateParents = function (tenants) {
        if(angular.isObject(tenants)) {
            tenants = [tenants];
        }

        angular.forEach(tenants, function(tenant) {
          if(!tenant.parentId) {
            return;
          }

          tenant.$parent = _.find(tenants, {
            id: tenant.parentId
          });
        });
      };

      $scope.create = function () {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId,
          adminUserId: Session.user.id,
          parentId: Session.tenant.tenantId
        });
      };

      $scope.submit = function () {
        return $scope.selectedTenant.save();
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.$on('created:resource:Tenant', function (event, newTenant) {
        if (newTenant.adminUserId === Session.user.id) {
          AuthService.refreshTenants();
        }
      });

      $scope.$on('updated:resource:Tenant', function () {
        AuthService.refreshTenants();
      });

      $scope.$on('session:tenant:changed', function () {
        vm.loadTenants();
      });

      $scope.$watch('selectedTenant', function (newVal) {
        if (newVal) {
          var result = angular.isDefined(newVal.$promise) ? newVal.$promise : newVal;
          $q.when(result).then(function (tenant) {
            tenant.$region = Region.cachedGet({
              id: tenant.regionId
            });

            if ($scope.selectedTenant.parentId) {
              tenant.$parent = Tenant.cachedGet({
                id: $scope.selectedTenant.parentId
              });
            }
          });
        }
      });

      $scope.tableConfig = tenantTableConfig(function () {
        return $scope.tenants;
      });

      vm.loadTenants();
    }
  ]);
