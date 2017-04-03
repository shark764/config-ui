'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$rootScope', '$scope', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'UserPermissions', 'AuthService', 'Region', '$q', 'loEvents', 'Timezone', 'PermissionGroups', 'Alert', 'GlobalRegionsList', 'Integration', 'Branding',
    function ($rootScope, $scope, Session, Tenant, TenantUser, tenantTableConfig, UserPermissions, AuthService, Region, $q, loEvents, Timezone, PermissionGroups, Alert, GlobalRegionsList, Integration, Branding) {
      var vm = this;

      $scope.colorPickerOptions = {
        // html attributes
        placeholder: '',
        // color
        format: 'hex',
        restrictToFormat: false,
        hue: true,
        saturation: true,
        case: 'upper',
        // swatch
        swatch: true,
        swatchPos: 'left',
        // popup
        round: false,
        pos: 'bottom left',
        inline: false,
      };

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

      vm.loadBranding = function (tenantId) {
        Branding.get({
          tenantId: tenantId
        }, function(responce){
          console.log(responce);
          $scope.brandingForm = responce;
        }, function(error){
          $scope.brandingForm = {};
          if (error.status !== 404) {
            console.log('Branding Styles Error:', error);
          }
        });
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
        $scope.selectedTenant.save(null, null, function (err) {
          if (err.data.error.attribute.parentId) {
            Alert.error(err.data.error.attribute.parentId);
          } else if (err.data.error.attribute.name) {
            Alert.error(err.data.error.attribute.name);
          }
        });
        if ($scope.brandingForm !== {}) {
          var selectedStyles = $scope.brandingForm.styles.formColors;
          var newStyles = {};
          // Save Form Colors for Repopulation Later
          newStyles.formColors = selectedStyles;

          // Create Custom CSS Overrides for Each Selected Color
          if (selectedStyles.navbar) {
            newStyles.navbar = {};
            newStyles.navbar['background-color'] = selectedStyles.navbar;
          }

          if (selectedStyles.navbarText) {
            newStyles.navbarText = {};
            newStyles.navbarText.color = selectedStyles.navbarText;
          }
          console.log(newStyles);
          Branding.update({
            tenantId: $scope.selectedTenant.id,
            styles: newStyles
          }, function(responce) {
            if (responce.tenantId === Session.tenant.tenantId) {
              $rootScope.branding = responce;
            }
          }, function(error) {
            if (error.status !== 404) {
              console.log('Branding Styles Error:', error);
            }
          });
        }
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
          deferred.resolve(_.find(GlobalRegionsList, {'awsId': regionResponse.name}).display);
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
          vm.loadBranding($scope.selectedTenant.id);
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

      $scope.resetDefaultBranding = function() {
        Branding.update({
          tenantId: $scope.selectedTenant.id,
          styles: {}
        }, function(responce){
          if (responce.tenantId === Session.tenant.tenantId) {
            $rootScope.branding = responce;
          }
          $scope.brandingForm = {};
        }, function(errors){
          console.log(errors);
        });
      };

      vm.loadTenants();
      vm.loadTimezones();
      vm.loadRegions();
    }
  ]);
