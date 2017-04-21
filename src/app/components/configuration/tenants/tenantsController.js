'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$window', '$http', '$rootScope', '$scope', 'Session', 'Tenant', 'TenantUser', 'tenantTableConfig', 'UserPermissions', 'AuthService', 'Region', '$q', 'loEvents', 'Timezone', 'PermissionGroups', 'Alert', 'GlobalRegionsList', 'Integration', 'Branding', '$translate', 'fileUpload', 'Modal',
    function ($window, $http, $rootScope, $scope, Session, Tenant, TenantUser, tenantTableConfig, UserPermissions, AuthService, Region, $q, loEvents, Timezone, PermissionGroups, Alert, GlobalRegionsList, Integration, Branding, $translate, fileUpload, Modal) {
      var vm = this;
      $scope.forms = {};

      var TenantSvc = new Tenant();

      $scope.colorPickerOptions = {
        // html attributes
        placeholder: '',
        format: 'hex',
        restrictToFormat: false,
        hue: true,
        saturation: true,
        case: 'upper',
        swatch: true,
        swatchPos: 'left',
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
        }, function(response){
          $scope.brandingForm = response;
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

        if ($scope.brandingForm !== {} && !angular.equals($scope.brandingForm, $scope.brandingForm.$original)) {
          submitBranding();
        }
      };

      function submitBranding() {
        if ($scope.brandingForm.updatelogo) {
          uploadImg('logo');
        } else if ($scope.brandingForm.updatefavicon) {
          uploadImg('favicon');
        } else {
          updateBranding();
        }
      }

      function uploadImg(type) {
        fileUpload.uploadImg($scope.brandingForm[type + 'Selected'], type)
          .then(function(){
            $scope.brandingForm['update' + type] = false;
            submitBranding();
          }, function(error){
            console.log(error);
            return Alert.error($translate.instant('tenant.branding.images.' + type + '.fileSizeError'));
          });
      }

      function updateBranding() {
        // Update Branding Colors and apply if on current tenant
        Branding.update({
          tenantId: $scope.selectedTenant.id,
          styles: $scope.brandingForm.styles
        }, function(response) {
          if (response.tenantId === Session.tenant.tenantId) {
            Branding.set(response);
          }
          Alert.success($translate.instant('tenant.branding.updated'));
        }, function(error) {
          if (error.status !== 404) {
            console.log('Branding Styles Error:', error);
          }
        });
      }

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

          // we need to set the session tenant's "tenantActive" property
          // here so that the tenant dropdown knows what to include
          TenantSvc.updateSessionTenantProps(result, 'active', 'tenantActive');
          $rootScope.$broadcast(loEvents.session.tenants.updated);
        });
      };

      $scope.tableConfig = tenantTableConfig(function () {
        return $scope.tenants;
      });

      $scope.resetDefaultBranding = function() {
        Modal.showConfirm(
          {
            message: $translate.instant('tenant.branding.resetDefault.confirm'),
            okCallback: function () {

              Branding.update({
                tenantId: $scope.selectedTenant.id,
                styles: {},
                logo: '',
                favicon: ''
              }, function(response){
                $scope.brandingForm = {};
                if (response.tenantId === Session.tenant.tenantId) {
                  Branding.set(response);
                }
                Alert.success($translate.instant('tenant.branding.resetDefault'));
              }, function(errors){
                console.log(errors);
              });
            }
          }
        );
      };

      $scope.fileSelected = function(element) {
        $scope.brandingForm[element.name + 'Selected'] = element.files[0];
        $scope.forms.detailsForm.$setDirty(true);

        // On file selection cancel, clear form and preview
        if ($scope.brandingForm[element.name + 'Selected'] === undefined) {
          $scope.brandingForm[element.name] = '';
          $scope.brandingForm.logoPreview = '';
          return;
        }

        // File Checking for size and type
        var maxFileSize = 1000000;
        var fileTypesAllowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
        if (element.name === 'favicon') {
          fileTypesAllowed.push('image/vnd.microsoft.icon', 'image/x-icon');
        }
        if ($scope.brandingForm[element.name + 'Selected'].size > maxFileSize || fileTypesAllowed.indexOf($scope.brandingForm[element.name + 'Selected'].type) === -1) {
          element.value = '';
          return Alert.error($translate.instant('tenant.branding.images.' + element.name + '.fileSizeError'));
        }

        // Conditional for on form submit to upload img first
        $scope.brandingForm['update' + element.name] = true;

        // Preview Image
        var reader  = new $window.FileReader();
        reader.addEventListener('load', function() {
          $scope.brandingForm[element.name + 'Preview'] = reader.result;
        }, false);
        reader.readAsDataURL($scope.brandingForm[element.name + 'Selected']);

      };

      vm.loadTenants();
      vm.loadTimezones();
      vm.loadRegions();
    }
  ]);
