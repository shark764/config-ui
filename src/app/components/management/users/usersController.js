'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$translate', 'User', 'Session', 'userTableConfig', 'Alert', '$q', 'TenantUser', 'TenantRole', 'UserPermissions', 'PlatformRole', 'TenantUserGroups', 'Modal', 'loEvents', 'ResetPassword', 'appFlags',
    function($scope, $translate, User, Session, userTableConfig, Alert, $q, TenantUser, TenantRole, UserPermissions, PlatformRole, TenantUserGroups, Modal, loEvents, ResetPassword, appFlags) {
      var vm = this;
      $scope.forms = {};
      $scope.Session = Session;
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

      $scope.displayVerint = appFlags.VERINT_INTEGRATION;

      $scope.resetPassword = function() {
        return Modal.showConfirm(
          {
            message: $translate.instant('value.passwordResetConfirm', { email:$scope.selectedTenantUser.email }),
            okCallback: ResetPassword.initiateReset.bind(null, $scope.selectedTenantUser.id)
          }
        );
      };

      $scope.scenario = function() {
        if (!$scope.selectedTenantUser) {
          return;
        }

        if ($scope.selectedTenantUser.$user.isNew()) {
          return 'invite:new:user';
        } else if ($scope.selectedTenantUser.isNew()) {
          return 'invite:existing:user';
        } else {
          return 'update';
        }
      };

      //isValid is for the tenantUser submit button
      //it excludes error type of 'duplicateEmail' and any extension input
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

      $scope.namesRequired = function() {
        if (!$scope.selectedTenantUser) {
          return false;
        }

        if ($scope.scenario() === 'update' && $scope.selectedTenantUser.$user.status !== 'pending') {
          return true;
        }

        return false;
      };

      $scope.fetchTenantUsers = function() {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenantRoles = function() {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchPlatformRoles = function() {
        return PlatformRole.cachedQuery();
      };

      $scope.create = function() {
        $scope.selectedTenantUser = new TenantUser({
          status: 'invited'
        });
        $scope.selectedTenantUser.$user = new User();
      };

      vm.saveTenantUser = function saveTenantUser() {
        return $scope.selectedTenantUser.save({
            tenantId: Session.tenant.tenantId
          })
          .then(function(tenantUser) {
            tenantUser.$skills = [];

            tenantUser.$groups = TenantUserGroups.query({
              memberId: tenantUser.id,
              tenantId: Session.tenant.tenantId
            });

            return tenantUser.save();
          });
      };

      $scope.canSaveUser = function(tenantUser) {
        return $scope.scenario() !== 'invite:existing:user' &&

          ((tenantUser && tenantUser.$user.isNew()) ||
            UserPermissions.hasPermission('MANAGE_ALL_USERS') ||
            (UserPermissions.hasPermission('PLATFORM_MANAGE_USER_ACCOUNT') &&
              Session.user.id === $scope.selectedTenantUser.$user.id) ||
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

        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function() {
          Alert.success($translate.instant('user.details.invite.send.success'));
        }, function() {
          Alert.error($translate.instant('user.details.invite.send.fail'));
        });
      };

      $scope.expireTenantUser = function() {
        Modal.showConfirm({
          message: 'This will prevent the user from accepting their invitation. Continue?',
          okCallback: function() {
            $scope.selectedTenantUser.status = 'pending';

            $scope.selectedTenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function() {
              Alert.success($translate.instant('user.details.invite.revoke.success'));
            }, function() {
              Alert.error($translate.instant('user.details.invite.revoke.fail'));
            });
          }
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });

      //TODO revisit this.
      $scope.$on('email:validator:found', function(event, tenantUser) {
        $scope.selectedTenantUser = tenantUser;
      });

      $scope.updateStatus = function(){
        if ($scope.selectedTenantUser.status !== 'accepted' && $scope.selectedTenantUser.status !== 'disabled'){
          return;
        }

        var userCopy = new TenantUser({
          id: $scope.selectedTenantUser.id,
          tenantId: $scope.selectedTenantUser.tenantId,
          status: $scope.selectedTenantUser.status === 'accepted' ? 'disabled' : 'accepted'
        });

        return userCopy.save(function(result){
          $scope.selectedTenantUser.$original.status = result.status;
        });
      };

      $scope.invitedUserExistsOnPlatform = function(){
        if (!$scope.selectedTenantUser || ! $scope.selectedTenantUser.$user){
          //Non-relevant selected tenant user
          return false;
        }

        if ($scope.selectedTenantUser.$user.status === 'pending'){
          //User hasn't signed up on the platform yet
          return false;
        }

        if ($scope.selectedTenantUser.status === 'accepted' || $scope.selectedTenantUser.status === 'disabled'){
          //User is already part of the tenant
          return false;
        }

        return true;
      };
    }
  ]);
