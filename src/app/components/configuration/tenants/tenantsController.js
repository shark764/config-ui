'use strict';

angular.module('liveopsConfigPanel').controller('TenantsController', [
  '$window',
  '$http',
  'apiHostname',
  '$rootScope',
  '$scope',
  'Session',
  'Tenant',
  'TenantUser',
  'tenantTableConfig',
  'UserPermissions',
  'AuthService',
  'Region',
  '$q',
  'loEvents',
  'Timezone',
  'PermissionGroups',
  'Alert',
  'GlobalRegionsList',
  'Integration',
  'Branding',
  '$translate',
  'fileUpload',
  'Modal',
  'IdentityProviders',
  '$timeout',
  '$location',
  'cxEngageAuthOptions',
  'cxEngageAuthStatesTenant',
  function(
    $window,
    $http,
    apiHostname,
    $rootScope,
    $scope,
    Session,
    Tenant,
    TenantUser,
    tenantTableConfig,
    UserPermissions,
    AuthService,
    Region,
    $q,
    loEvents,
    Timezone,
    PermissionGroups,
    Alert,
    GlobalRegionsList,
    Integration,
    Branding,
    $translate,
    fileUpload,
    Modal,
    IdentityProviders,
    $timeout,
    $location,
    cxEngageAuthOptions,
    cxEngageAuthStatesTenant
  ) {
    var vm = this;
    var TenantSvc = new Tenant();
    $scope.forms = {};
    $scope.idpsLoaded = false;

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
      inline: false
    };

    $scope.colorPickerEvents = {
      onChange: function() {
        $scope.forms.detailsForm.$setDirty();
      }
    };

    $scope.toggleRegionField = function(integrationId) {
      $scope.selectedTenant.hasTwilio = _.some($scope.integrations, {
        id: integrationId,
        type: 'twilio'
      });
    };

    $scope.displayAsyncForms = function() {
      return $scope.brandingLoaded && $scope.idpsLoaded && $scope.watchDataLoaded;
    };

    vm.loadTimezones = function() {
      $scope.timezones = Timezone.query();
    };

    vm.loadRegions = function() {
      $scope.regions = Region.query();
    };

    vm.loadSlas = function() {
      // SDK function uses tenantId setted in the SDK session,
      // but this function to load SLAs is called sometimes before
      // the tenant is setted.
      // Session gets tenant active first, so we change to http service request
      $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/slas',
        headers: {
          Authorization: 'Token ' + Session.token
        }
      }).then(function(response) {
        $scope.slas = _.filter(response.data.result, function(sla) {
          return sla.active && sla.activeVersion;
        });
      });
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

      var promise = $scope.tenants.$promise.then(vm.loadUsers);

      return promise;
    };
    vm.loadUsers = function(tenants) {
      $scope.users = TenantUser.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
      return tenants;
    };

    vm.loadBranding = function(tenantId) {
      $scope.brandingLoaded = false;
      if (!tenantId) {
        $scope.brandingForm = {};
        $scope.brandingLoaded = true;
        return;
      }

      var branding = Branding.cachedGet(
        {
          tenantId: tenantId
        },
        'Branding',
        true
      );

      branding.$promise.then(
        function(response) {
          $scope.brandingForm = response;
          $scope.brandingLoaded = true;
        },
        function(error) {
          $scope.brandingForm = {};
          if (error.status !== 404) {
            console.log('Branding Styles Error:', error);
          }
          $scope.brandingLoaded = true;
        }
      );

      CxEngage.entities.getProtectedBranding(function(error, topic, response) {
        var address = _.find(response.result, { key: 'fromAddress' });
        if (address && address.active === true) {
          $scope.fromAddress = address.value;
        } else {
          $scope.fromAddress = false;
        }
      });
    };

    vm.loadIntegrations = function(tenantId) {
      if (!tenantId) {
        $scope.integrations = [];
        return;
      }

      $scope.integrations = Integration.cachedQuery(
        {
          tenantId: tenantId
        },
        'Integration',
        true
      );

      $scope.integrations.$promise.then(function() {
        $scope.toggleRegionField($scope.selectedTenant.outboundIntegrationId);
      });
    };

    $scope.create = function() {
      $location.search({});

      $scope.selectedTenant = new Tenant({
        regionId: Session.activeRegionId,
        adminUserId: Session.user.id,
        parentId: Session.tenant.tenantId,
        timezone: 'US/Eastern', //Default to US-east timezone
        defaultIdentityProvider: null,
        cxengageIdentityProvider: cxEngageAuthStatesTenant.enabled
      });

      updateIdentityProvidersList($scope.selectedTenant);
    };

    var user;
    var tenantAdminChanged = false;

    $scope.changeTenantAdmin = function() {
      tenantAdminChanged = true;
    };

    $scope.submit = function() {
      delete $scope.selectedTenant.identityProviders;

      if (!$scope.selectedTenant.id) {
        $scope.selectedTenant = _.omit($scope.selectedTenant, [
          'defaultIdentityProvider',
          'disableCxAuthSelect',
          'disableSsoSelect',
          'resourceName',
          'cxengageIdentityProvider'
        ]);
      }

      $scope.selectedTenant.save(
        function(response) {
          $scope.toggleRegionField(response.outboundIntegrationId);
          if (tenantAdminChanged) {
            for (user in $scope.users) {
              if ($scope.users[user].id === $scope.selectedTenant.adminUserId) {
                Alert.success(
                  $translate.instant('tenant.save.admin') +
                    $scope.users[user].$user.firstName +
                    ' ' +
                    $scope.users[user].$user.lastName
                );
              }
            }

            tenantAdminChanged = false;
          }

          updateIdentityProvidersList(response, true);
          Alert.success($translate.instant('tenant.save.success'));
        },
        function(err) {
          if (err.data.error.attribute.parentId) {
            Alert.error(err.data.error.attribute.parentId);
          } else if (err.data.error.attribute.name) {
            Alert.error(err.data.error.attribute.name);
          }
          $scope.idpsLoaded = true;
        }
      );

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
      fileUpload.uploadImg($scope.brandingForm[type + 'Selected'], type).then(
        function() {
          $scope.brandingForm['update' + type] = false;
          submitBranding();
        },
        function(error) {
          console.log(error);
          return Alert.error($translate.instant('tenant.branding.images.' + type + '.fileSizeError'));
        }
      );
    }

    function updateBranding() {
      // Update Branding Colors and apply if on current tenant
      Branding.update(
        {
          tenantId: $scope.selectedTenant.id,
          styles: $scope.brandingForm.styles
        },
        function(response) {
          if (response.tenantId === Session.tenant.tenantId) {
            Branding.set(response);
          }
          Alert.success($translate.instant('tenant.branding.updated'));
        },
        function(error) {
          if (error.status !== 404) {
            console.log('Branding Styles Error:', error);
          }
        }
      );
    }

    $scope.$on(loEvents.tableControls.itemCreate, function() {
      $scope.create();
    });

    $scope.$on('created:resource:Tenant', function(event, newTenant) {
      if (newTenant.adminUserId === Session.user.id) {
        AuthService.refreshTenants();
      }
      $scope.selectedTenant = newTenant;
    });

    function getTenantRegionDisplay(tenant) {
      var deferred = $q.defer();

      var region = Region.cachedGet({
        id: tenant.regionId
      });

      // once we get the region data, find the "name" property of the region response
      region.$promise.then(function(regionResponse) {
        // next, return the object from the GlobalRegionsList service where the tenantId value matches
        // what we got from the region response, and then return the "display" property of that object
        deferred.resolve(_.find(GlobalRegionsList, { awsId: regionResponse.name }).display);
      });

      return deferred.promise;
    }

    function updateIdentityProvidersList(tenantData, resetForm) {
      if (
        !angular.isObject(tenantData) ||
        !UserPermissions.hasPermissionInList(PermissionGroups.viewIdentityProviders)
      ) {
        $scope.idpsLoaded = true;
        return;
      }

      var identityProviders = [];
      var idpList = [];
      $scope.idpsLoaded = false;
      tenantData.disableCxAuthSelect = true;
      tenantData.disableSsoSelect = true;

      // this flag tells us whether or not to allow the user to disable the CxEngage native IDP
      $scope.loggedInWithCxEngageIdp = tenantData.id === Session.tenant.tenantId && !Session.isSso;

      $scope.cxEngageAuthOptions = cxEngageAuthOptions();

      // get all of the IDP's and trim the data down
      // to the id and name properties only
      if (tenantData.id) {
        identityProviders = IdentityProviders.cachedQuery(
          {
            tenantId: tenantData.id
          },
          'IdentityProviders',
          true
        ).$promise;
      } else {
        // placeholder promise for new Tenants
        identityProviders = $q.defer().$promise;
      }

      $q.when(identityProviders).then(function(identityProvidersResponse) {
        if (angular.isArray(identityProvidersResponse)) {
          idpList = _.map(
            _.filter(identityProvidersResponse, function(idp) {
              return idp.active;
            }),
            function(filteredIdp) {
              return _.pick(filteredIdp, ['id', 'name']);
            }
          );
        } else {
          idpList = [];
        }

        if (idpList.length) {
          tenantData.identityProviders = idpList;

          if (!tenantData.defaultIdentityProvider) {
            tenantData.defaultIdentityProvider = idpList[0].id;
          }

          tenantData.disableCxAuthSelect = false;
          tenantData.disableSsoSelect = false;
        } else {
          tenantData.identityProviders = [
            {
              id: null,
              name: $translate.instant('value.none')
            }
          ];

          tenantData.defaultIdentityProvider = tenantData.identityProviders[0].id;
          tenantData.disableSsoSelect = true;
          tenantData.disableCxAuthSelect = true;
        }

        if (
          !tenantData.identityProviders.length ||
          !tenantData.defaultIdentityProvider ||
          _.findIndex(tenantData.identityProviders, { id: tenantData.defaultIdentityProvider }) === -1
        ) {
          tenantData.defaultIdentityProvider = tenantData.identityProviders[0].id;
        }

        $rootScope.$broadcast(loEvents.session.tenants.updated);

        // reset the form only after the tenant data has completely loaded
        if (resetForm) {
          $scope.forms.detailsForm.$setPristine();
          $scope.forms.detailsForm.$setUntouched();
        }

        _.merge($scope.selectedTenant, tenantData);
        $scope.idpsLoaded = true;
      });
    }

    $scope.$watch('selectedTenant', function(selectedTenantResponse) {
      $scope.watchDataLoaded = false;
      if (selectedTenantResponse) {
        $q.when(selectedTenantResponse).then(function(tenantResponse) {
          // here is where we get the "user friendly" universal display name for the region
          var tenantDisplayName = getTenantRegionDisplay(tenantResponse);

          tenantDisplayName.then(function(displayResponse) {
            $scope.selectedTenant.$regionDisplay = displayResponse;
          });

          updateIdentityProvidersList(tenantResponse);

          vm.loadIntegrations($scope.selectedTenant.id);
          vm.loadBranding($scope.selectedTenant.id);

          $timeout(function() {
            $scope.watchDataLoaded = true;
          });
        });
      }
    });

    $scope.setViewOnlyTenant = function() {
      Session.setTenant({
        tenantId: $scope.selectedTenant.id,
        tenantName: $scope.selectedTenant.name + ' *',
        tenantPermissions: PermissionGroups.readAllMode
      });
      $rootScope.$emit('readAllMode');

      // Removing impersonate tenant data from sessionStorage
      // when setting tenant as active
      sessionStorage.removeItem('LOGI-TENANT-IMPERSONATE');
    };

    $scope.setTenantAsImpersonated = function() {
      sessionStorage.setItem(
        'LOGI-TENANT-IMPERSONATE',
        JSON.stringify({
          tenantId: $scope.selectedTenant.id,
          tenantName: $scope.selectedTenant.name
        })
      );
      $rootScope.$emit('impersonatingTenant');
      Alert.info($translate.instant('tenant.details.reporting.impersonated'));
    };

    $scope.updateActive = function() {
      var tenantCopy = new Tenant({
        id: $scope.selectedTenant.id,
        regionId: $scope.selectedTenant.regionId,
        active: !$scope.selectedTenant.active
      });

      return tenantCopy.save(null, function(result) {
        $scope.selectedTenant.$original.active = result.active;

        // we need to set the session tenant's "tenantActive" property
        // here so that the tenant dropdown knows what to include
        TenantSvc.updateSessionTenantProps(result, 'active', 'tenantActive');
        $rootScope.$broadcast(loEvents.session.tenants.updated);
        updateIdentityProvidersList(result, true);
      });
    };

    $scope.tableConfig = tenantTableConfig(function() {
      return $scope.tenants;
    });

    $scope.resetDefaultBranding = function() {
      Modal.showConfirm({
        message: $translate.instant('tenant.branding.resetDefault.confirm'),
        okCallback: function() {
          Branding.update(
            {
              tenantId: $scope.selectedTenant.id,
              styles: {},
              logo: '',
              favicon: ''
            },
            function(response) {
              $scope.brandingForm = {};
              if (response.tenantId === Session.tenant.tenantId) {
                Branding.set(response);
              }
              Alert.success($translate.instant('tenant.branding.resetDefault'));
            },
            function(errors) {
              console.log(errors);
            }
          );
        }
      });
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
      if (
        $scope.brandingForm[element.name + 'Selected'].size > maxFileSize ||
        fileTypesAllowed.indexOf($scope.brandingForm[element.name + 'Selected'].type) === -1
      ) {
        element.value = '';
        return Alert.error($translate.instant('tenant.branding.images.' + element.name + '.fileSizeError'));
      }

      // Conditional for on form submit to upload img first
      $scope.brandingForm['update' + element.name] = true;

      // Preview Image
      var reader = new $window.FileReader();
      reader.addEventListener(
        'load',
        function() {
          $scope.brandingForm[element.name + 'Preview'] = reader.result;
        },
        false
      );
      reader.readAsDataURL($scope.brandingForm[element.name + 'Selected']);
    };

    vm.loadTenants();
    vm.loadTimezones();
    vm.loadRegions();
    vm.loadSlas();

    $scope.idpListFilter = function(idpObj) {
      // providing a fallback value since there appear to be some IDP's
      // with a null value for the name property
      idpObj.name = idpObj.name || $translate.instant('tenant.details.unnamedIdp') + idpObj.id;

      return idpObj;
    };
  }
]);
