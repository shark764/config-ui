'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$rootScope', '$scope', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'UserPermissions', 'AuthService', 'Region', '$q', 'loEvents', 'Timezone', 'PermissionGroups', 'Alert', 'GlobalRegionsList', 'Integration',
    function ($rootScope, $scope, Session, Tenant, TenantUser, tenantTableConfig, UserPermissions, AuthService, Region, $q, loEvents, Timezone, PermissionGroups, Alert, GlobalRegionsList, Integration) {
      var vm = this;

      vm.loadTimezones = function () {
        $scope.timezones = Timezone.query();
      };

      vm.loadRegions = function() {
        $scope.regions = Region.query();
      };

      vm.loadTenants = function () {
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

      vm.loadUsers = function (tenants) {
        $scope.users = TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        return tenants;
      };

      vm.loadIntegrations = function(tenantId) {
        // tried using cachedQuery but it didn't work when selectedTenant was changed
        $scope.integrations = Integration.query({
          tenantId: tenantId
        });
      };

      $scope.create = function () {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId,
          adminUserId: Session.user.id,
          parentId: Session.tenant.tenantId,
          timezone: 'US/Eastern' //Default to US-east timezone
        });
      };

      $scope.submit = function () {
        return $scope.selectedTenant.save(null, null, function (err) {
          if (err.data.error.attribute.parentId) {
            Alert.error(err.data.error.attribute.parentId);
          } else if (err.data.error.attribute.name) {
            Alert.error(err.data.error.attribute.name);
          }
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.$on('created:resource:Tenant', function (event, newTenant) {
        if (newTenant.adminUserId === Session.user.id) {
          AuthService.refreshTenants();
        }
      });

      function getTenantRegionDisplay(tenant) {
        var deferred = $q.defer();

        var region = Region.cachedGet({
          id: tenant.regionId
        });

        // once we get the region data, find the "name" property of the region response
        region.$promise.then(function (regionResponse) {
          // next, return the object from the GlobalRegionsList service where the tenantId value matches
          // what we got from the region response, and then return the "display" property of that object
          deferred.resolve(_.findWhere(GlobalRegionsList, {'awsId': regionResponse.name}).display);
        });

        return deferred.promise;
      }


      $scope.$watch('selectedTenant', function (newVal) {
        if (newVal) {
          // here is where we get the "user friendly" universal display name for the region
          var result = angular.isDefined(newVal.$promise) ? newVal.$promise : newVal;
          $q.when(result).then(function (tenantResponse) {
            var tenantDisplayName = getTenantRegionDisplay(tenantResponse);

            tenantDisplayName.then(function (displayResponse) {
              $scope.selectedTenant.$regionDisplay = displayResponse;
            });
          });

          vm.loadIntegrations($scope.selectedTenant.id);
        }
      });

      $scope.setViewOnlyTenant = function() {
        Session.setTenant({
          tenantId: $scope.selectedTenant.id,
          tenantName: $scope.selectedTenant.name + ' *',
          tenantPermissions: PermissionGroups.readAllMode
        });
        $rootScope.$emit('readAllMode');
      };

      $scope.updateActive = function () {
        var tenantCopy = new Tenant({
          id: $scope.selectedTenant.id,
          regionId: $scope.selectedTenant.regionId,
          active: !$scope.selectedTenant.active
        });

        return tenantCopy.save(function (result) {
          $scope.selectedTenant.$original.active = result.active;
        });
      };

      $scope.tableConfig = tenantTableConfig(function () {
        return $scope.tenants;
      });

      vm.loadTenants();
      vm.loadTimezones();
      vm.loadRegions();
    }
  ]);
