'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$translate', '$location', 'User', 'Session', 'userTableConfig', 'Alert', '$q', 'Tenant', 'TenantUser', 'TenantRole', 'UserPermissions', 'PlatformRole', 'TenantUserGroups', 'Modal', 'loEvents', 'ResetPassword', 'Integration', 'Me', 'IdentityProviders', '$timeout', 'cxEngageAuthOptions', 'cxEngageAuthStatesTenant', 'cxEngageAuthStatesUser', 'userInviteStatuses',
    function($scope, $translate, $location, User, Session, userTableConfig, Alert, $q, Tenant, TenantUser, TenantRole, UserPermissions, PlatformRole, TenantUserGroups, Modal, loEvents, ResetPassword, Integration, Me, IdentityProviders, $timeout, cxEngageAuthOptions, cxEngageAuthStatesTenant, cxEngageAuthStatesUser, userInviteStatuses) {
      var vm = this;
      var MeSvc = new Me();
      var IdpSvc = new IdentityProviders();
      var TenantUserSvc = new TenantUser ();
      var newSkills = [];
      var idpList = [];

      $scope.loadingIdps = true;
      $scope.loadingIdpList = true;
      $scope.forms = {};
      $scope.Session = Session;
      $scope.resetBtn = 'reset';
      $scope.resendBtn = 'resend';
      $scope.identityProviders = [];
      $scope.roleData = [];

      $scope.tenantData = Tenant.cachedGet({
        id: Session.tenant.tenantId,
      });

      TenantRole.cachedQuery({
        tenantId: Session.tenant.tenantId
      }).$promise.then(function(roles){
        $scope.roleData = _.uniq(roles, 'id');
      });

      $q.all([
        IdpSvc.getActiveFilteredIdps(),
        $scope.tenantData
      ]).then(function (response) {
        var tenantDefaultNameIdx;
        var tenantDefaultName = '';
        idpList = response[0];

        if (idpList.length) {
          // ...let's grab the user-facing name of the TENANT's
          // default IDP to display on the first option in the dropdown
          if (response[1].defaultIdentityProvider) {
            tenantDefaultNameIdx = _.findIndex(idpList, {
              id: response[1].defaultIdentityProvider
            });

            // Make sure that the tenant's default IDP is available to this user
            if (tenantDefaultNameIdx !== -1) {
              tenantDefaultName = ': ' + idpList[tenantDefaultNameIdx].name;
            }
          }

          // if we haven't done so already, insert the "Use Tenant Option"
          // as the 1st item in the dropdown
          if (_.findIndex(idpList, {'id': null}) === -1) {
            idpList.unshift({
              id: null,
              name: $translate.instant('user.details.tenantDefault') + tenantDefaultName
            });
          }

          $scope.loadingIdpList = false;

        } else {
          // If there are no IDP's at all, just set a null
          // value and only display a "None" option
          idpList = [{
            id: null,
            name: $translate.instant('user.details.noIdps')
          }];

          $scope.loadingIdpList = false;
        }

        $scope.identityProviders = idpList;
        $scope.loadingIdpList = false;

      });

      $scope.displaySsoFields = function () {
        return (
          $scope.loadingIdps === false &&
          $scope.loadingIdpList === false
        );
      };

      $scope.fetchTenantUsers = function() {
        $scope.hasCxEngageIdp = MeSvc.getHasCxEngageIdp();

        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenantUsers().$promise.then(function(data) {
        $scope.tenantUsers = data;
        $scope.hasCxEngageIdp = MeSvc.getHasCxEngageIdp();
        var hasZeroSkill = false;
        angular.forEach(data, function(value) {
          angular.forEach(value.$skills, function(VSValue) {
            if (!_.find(newSkills, function(o) {
                return o.name === VSValue.name;
              })) {
              newSkills.push({
                id: VSValue.id,
                name: VSValue.name,
                active: VSValue.active,
                checked: VSValue.checked,
                hasProficiency: VSValue.hasProficiency,
                tenantId: VSValue.tenantId,
                description: ''
              });
            }
          });

          if (value.$skills.length === 0) {
            hasZeroSkill = true;
          }
        });

        if (hasZeroSkill) {
          newSkills.push({
            id: '00000',
            name: 'No Skill',
            active: true,
            checked: true,
            hasProficiency: false,
            tenantId: Session.tenant.tenantId,
            description: ''
          });
        }
      });

      function newSkillsReturn() {
        return newSkills;
      }

      function newRolesReturn() {
        return $scope.roleData;
      }

      userTableConfig.getConfig().fields[3].header.options = newSkillsReturn;
      userTableConfig.getConfig().fields[5].header.options = newRolesReturn;
      $scope.userTableConfig = userTableConfig;

      var extensionFields = [
        'extensions',
        'activeExtension',
        'type',
        'provider',
        'telValue',
        'phoneExtension',
        'extensiondescription',
        'region'
      ];

      $scope.setInviteButton = function (tenantUserObj, btnType) {
        if (!tenantUserObj) {
          return;
        }

        // If this user or the current tenant has a Cx Login...
        if (
          tenantUserObj.noPassword !== cxEngageAuthStatesUser.disabled &&
          (
            tenantUserObj.noPassword !== cxEngageAuthStatesUser.enabled ||
            $scope.tenantCxLoginStatus === 'enabled'
          )
        ) {
          // if the user has username and password set, then show the "reset" button
          if (
            (tenantUserObj.invitationStatus === 'accepted' ||
             tenantUserObj.invitationStatus === 'enabled')
            &&
            !$scope.savedCxStatus
          ) {
            if (btnType === $scope.resetBtn) {
              return true;
            }

            return false;
          } else if (_.indexOf(userInviteStatuses, tenantUserObj.invitationStatus) !== -1) {
            // if they haven't set a password yet, then show the "resend" button
            if (btnType === $scope.resendBtn) {
              return true;
            }

            return false;
          }
        }

        return false;
      };

      $scope.displayExpireLink = function () {
        return $scope.selectedTenantUser.invitationStatus === 'invited';
      };

      function getIdentityProviders (tenantUserData) {
        $scope.loadingIdps = true;

        // if there is no tenant data or we don't have permission,
        // let's bail out of this thing!
        if (
          !tenantUserData ||
          !(
            UserPermissions.hasPermission('USER_IDENTITY_PROVIDER_VIEW') &&
            UserPermissions.hasPermission('IDENTITY_PROVIDERS_READ')
          )
        ) {
          $scope.loadingIdps = false;
          return;
        }

        tenantUserData.disableCxEngageStatusSelect = false;

        // if there is only 1 or zero available IDPs, then no need to enable
        // that dropdown
        tenantUserData.disableDefaultSsoProvider = $scope.identityProviders.length < 2;

        var noPassword = tenantUserData.noPassword;
        var tenantDefaultVal = '';
        $scope.tenantCxLoginStatus = $scope.tenantData.cxengageIdentityProvider;

        // First, get the status of CxEngage on the tenant to display
        // in the dropdown as part of the "Tenant Default" option
        if ($scope.tenantData.cxengageIdentityProvider) {
          $scope.tenantCxLoginStatus = $scope.tenantData.cxengageIdentityProvider;
          tenantDefaultVal = $scope.tenantData.cxengageIdentityProvider === cxEngageAuthStatesTenant.enabled
          ? cxEngageAuthStatesUser.enabled
          : cxEngageAuthStatesUser.disabled;
        }

        // Now override any CxEngage status if it has been
        // disabled at the tenant level
        if ($scope.tenantData.cxengageIdentityProvider === cxEngageAuthStatesTenant.denied) {
          tenantUserData.noPassword = tenantDefaultVal = cxEngageAuthStatesUser.denied;
          tenantUserData.disableCxEngageStatusSelect = true;
        } else if (
          // if the user has no SSO IDP's or is currently logged in with
          // Cx, then prevent Cx from being disabled
          $scope.identityProviders.length < 2 ||
          (
            !Session.isSso &&
            tenantUserData.id === Session.user.id
          )
        ) {
          tenantUserData.noPassword = cxEngageAuthStatesUser.enabled;
          tenantUserData.disableCxEngageStatusSelect = true;
        } else if (!_.isBoolean(noPassword)) {
          // if CxEngage status is not set, then set it to default
          tenantUserData.noPassword = cxEngageAuthStatesUser.tenantDefault;
        } else {
          tenantUserData.noPassword = noPassword
            ? cxEngageAuthStatesUser.disabled
            : cxEngageAuthStatesUser.enabled;
        }

        $scope.savedCxStatus = tenantUserData.noPassword;

        // populate the CxEngage Authentication dropdown
        $scope.cxEngageAuthOptions = cxEngageAuthOptions(tenantDefaultVal);

        if (
          !$scope.identityProviders.length ||
          !tenantUserData.defaultIdentityProvider ||
          _.findIndex($scope.identityProviders, {id: tenantUserData.defaultIdentityProvider}) === -1
        ) {

          tenantUserData.defaultIdentityProvider = $scope.identityProviders[0].id;
        }

        _.merge($scope.selectedTenantUser, tenantUserData);
        $scope.loadingIdps = false;
      }

      $scope.tenantIntegrations = Integration.cachedQuery({
        tenantId: Session.tenant.tenantId
      }, 'Intergration', true);

      $scope.hasVerintIntegration = false;
      $scope.hasTwilioIntegration = false;

      $scope.tenantIntegrations.$promise.then(function(response) {
        // determine whether or not there are active verint and twilio extensions
        _.forEach(response, function (integration) {
          if (
            !$scope.hasVerintIntegration &&
            integration.type === 'verint'
          ) {
            $scope.hasVerintIntegration = true;
          }

          if (
            $scope.hasTwilioIntegration === false &&
            integration.type === 'twilio' &&
            integration.active === true &&
            integration.properties.webRtc === true
          ) {
            $scope.hasTwilioIntegration = true;
          }
        });
      }, function(error) {
        // Workaround to enable supervisors to view their extensions - due to
        // them not having permission to GET the integration route.
        if (error.status === 403) {
          $scope.hasTwilioIntegration = true;
        }
      });

      $scope.resetPassword = function() {
        return Modal.showConfirm(
          {
            message: $translate.instant('value.passwordResetConfirm', { email:$scope.selectedTenantUser.email }),
            okCallback: function () {
              ResetPassword.initiateReset($scope.selectedTenantUser.id).then(function (response) {
                Alert.success($translate.instant('user.details.resetpassword.success'));
                // reset the SSO UI
                handleTenantUserSelect(_.merge($scope.selectedTenantUser, {
                  invitationStatus: response.data.results.invitationStatus
                }));


              }, function() {
                Alert.error($translate.instant('user.details.resetpassword.fail'));
              });
            }
          }
        );
      };

      $scope.scenario = function() {
        if (!$scope.selectedTenantUser) {
          return;
        }

        if (
          $scope.selectedTenantUser.$user &&
          angular.isFunction($scope.selectedTenantUser.$user.isNew) &&
          $scope.selectedTenantUser.$user.isNew()
        ) {
          return 'invite:new:user';
        } else if (angular.isFunction($scope.selectedTenantUser.isNew) && $scope.selectedTenantUser.isNew()) {
          return 'invite:existing:user';
        } else {
          return 'update';
        }
      };

      // isValid is for the tenantUser submit button
      // it excludes error type of 'duplicateEmail' and any extension input
      $scope.isValid = function() {
        var valid = true;
        for(var errorTypeIndex in $scope.forms.detailsForm.$error) {
          if(errorTypeIndex === 'duplicateEmail') {
            continue;
          }

          var errorType = $scope.forms.detailsForm.$error[errorTypeIndex];

          for(var errorIndex = 0; errorIndex < errorType.length; errorIndex++) {
            var errorModel = errorType[errorIndex];
            if(extensionFields.indexOf(errorModel.$name) > -1) {
              continue;
            }

            valid = valid && errorModel.$valid;
          }
        }

        return valid;
      };

      $scope.namesRequired = function () {
        if (!$scope.selectedTenantUser) {
          return false;
        }

        if ($scope.scenario() === 'update') {
          return true;
        }

        return false;
      };

      $scope.fetchTenantRoles = function() {
        return $scope.roleData;
      };

      $scope.fetchPlatformRoles = function() {
        return PlatformRole.cachedQuery();
      };

      $scope.create = function() {
        $location.search({});
        $scope.selectedTenantUser = new TenantUser({
          status: 'invited'
        });
        $scope.selectedTenantUser.$user = new User({
          status: 'invited'
        });
        getIdentityProviders($scope.selectedTenantUser);
      };

      vm.saveTenantUser = function saveTenantUser() {
        $scope.loadingIdps = true;
        $scope.selectedTenantUser = TenantUserSvc.removePropsBeforeSave($scope.selectedTenantUser);

        return $scope.selectedTenantUser.save({
            tenantId: Session.tenant.tenantId
          })
          .then(function(tenantUser) {
            tenantUser.$skills = [];
            tenantUser = TenantUserSvc.removePropsBeforeSave(tenantUser);

            tenantUser.$groups = TenantUserGroups.query({
              memberId: tenantUser.id,
              tenantId: Session.tenant.tenantId
            });
            delete tenantUser.activeExtension;

            return tenantUser.save()
            .then(function (tenantUserResponse) {
              Alert.success($translate.instant('user.details.save.success'));
              _.merge($scope.selectedTenantUser, tenantUserResponse);
              getIdentityProviders($scope.selectedTenantUser, true);
            }, function (err) {
              Alert.error($translate.instant(err.data.error.message.capitalize()));
              $scope.loadingIdps = false;
            });
          }, function (err) {
            Alert.error($translate.instant(err.data.error.message.capitalize()));
            $scope.loadingIdps = false;
          });
      };

      $scope.canSaveUser = function(tenantUser) {
        return $scope.scenario() !== 'invite:existing:user' &&

          ((tenantUser && tenantUser.$user && tenantUser.$user.isNew()) ||
            UserPermissions.hasPermission('MANAGE_ALL_USERS') ||
            (UserPermissions.hasPermission('PLATFORM_MANAGE_USER_ACCOUNT') &&
              (_.has($scope, 'selectedTenantUser.$user.id') && Session.user.id === $scope.selectedTenantUser.$user.id)) ||
            UserPermissions.hasPermission('PLATFORM_MANAGE_ALL_USERS'));
      };

      vm.canSaveTenantUser = function(tenantUser) {
        return tenantUser.isNew() ||
          (UserPermissions.hasPermissionInList([
            'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
            'MANAGE_TENANT_ENROLLMENT'
          ]));
      };

      $scope.submit = function() {
        if ($scope.scenario() === 'invite:new:user') {
          $scope.selectedTenantUser.$user.email = $scope.selectedTenantUser.email;
        }

        var userSave = $scope.canSaveUser($scope.selectedTenantUser) ?
          $scope.selectedTenantUser.$user.save :
          $q.when;

        var tenantUserSave = vm.canSaveTenantUser($scope.selectedTenantUser) ?
          vm.saveTenantUser :
          $q.when;

        return userSave.call($scope.selectedTenantUser.$user)
          .then(tenantUserSave);
      };

      $scope.resend = function() {
        $scope.selectedTenantUser.status = 'invited';
        $scope.selectedTenantUser = TenantUserSvc.removePropsBeforeSave($scope.selectedTenantUser);

        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function(response) {
          // reset the SSO UI
          handleTenantUserSelect(response);
          Alert.success($translate.instant('user.details.invite.send.success'));
        }, function() {
          Alert.error($translate.instant('user.details.invite.send.fail'));
          $scope.loadingIdps = false;
        });
      };

      $scope.expireTenantUser = function() {
        Modal.showConfirm({
          // TODO: This needs to use the $translate method and not be hard-coded
          message: $translate.instant('invite.accept.cancelInvitation.confirm'),
          okCallback: function() {
            $scope.selectedTenantUser.status = 'pending';

            $scope.selectedTenantUser = TenantUserSvc.removePropsBeforeSave($scope.selectedTenantUser, true);

            $scope.selectedTenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function(response) {
              Alert.success($translate.instant('user.details.invite.revoke.success'));
              // reset the SSO UI
              handleTenantUserSelect(response);
            }, function() {
              Alert.error($translate.instant('user.details.invite.revoke.fail'));
              $scope.loadingIdps = false;
            });
          }
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      function handleTenantUserSelect (tenantUserData) {
        $scope.selectedTenantUser = tenantUserData;
        $scope.loadingIdps = true;
        if (angular.isObject(tenantUserData) && !angular.isArray(tenantUserData)) {
          // unfortunately we need to call an individual tenantUser b/c
          // the list of tenantUsers doesn't contain all the data we need
          var tenantUserObj = TenantUser.cachedGet({
            tenantId: Session.tenant.tenantId,
            id: tenantUserData.id
          }, 'TenantUserCached', true);

          $q.when(tenantUserObj.$promise).then(function (tenantUser) {
            getIdentityProviders(tenantUser);
          }, function () {
            Alert.error($translate.instant('user.details.getUserAuthSettings.fail'));
            $scope.loadingIdps = false;
          });

        } else {
          $scope.loadingIdps = false;
        }
      }

      //TODO revisit this.
      $scope.$on('email:validator:found', function(event, tenantUser) {
        $scope.selectedTenantUser = tenantUser;
        handleTenantUserSelect(tenantUser);
      });

      $scope.$on(loEvents.tableControls.itemSelected, function (event, selectedUserResponse) {
        $q.when(selectedUserResponse).then(function (tenantUserResponse) {
          handleTenantUserSelect(tenantUserResponse);
        });
      });

      $scope.hasRequiredProps = function (tenantUserData) {
        if (!tenantUserData) {
          return false;
        }

        return (
          tenantUserData.status === 'disabled' &&
          $scope.namesRequired(tenantUserData) &&
          (
            !tenantUserData.$original.$user.firstName ||
            !tenantUserData.$original.$user.lastName
          )
        );
      };

      $scope.updateStatus = function() {
        var userCopy = new TenantUser({
          id: $scope.selectedTenantUser.id,
          tenantId: $scope.selectedTenantUser.tenantId,
          status: $scope.selectedTenantUser.status === 'accepted' ? 'disabled' : 'accepted'
        });

        return userCopy.save().then(function(result){
          $scope.selectedTenantUser.$original.status = result.status;
        }, function () {
          Alert.error($translate.instant('user.details.statusChange.fail'));
        });
      };

      $scope.invitedUserExistsOnPlatform = function() {
        // prevent error if user data is not loaded
        if (!$scope.selectedTenantUser || ! $scope.selectedTenantUser.$user){
          return false;
        }

        if (
          $scope.selectedTenantUser.$user.created ||
          !$scope.selectedTenantUser.isNew()
        ) {
          //User hasn't signed up on the platform yet
          return false;
        }

        return true;
      };
    }
  ]);
