'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$translate', 'User', 'Session', 'userTableConfig', 'Alert', '$q', 'TenantUser', 'TenantRole', 'UserPermissions', 'PlatformRole', 'TenantUserGroups', 'Modal', 'loEvents',
    function($scope, $translate, User, Session, userTableConfig, Alert, $q, TenantUser, TenantRole, UserPermissions, PlatformRole, TenantUserGroups, Modal, loEvents) {
      var vm = this;
      $scope.forms = {};
      $scope.Session = Session;
      $scope.userTableConfig = userTableConfig;

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
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();
      };

      vm.saveTenantUser = function saveTenantUser() {

        // cover the case for existing tenant users who
        // do not have active extension set
        vm.setDefaultActiveExtension($scope.selectedTenantUser);

        return $scope.selectedTenantUser.save({
            tenantId: Session.tenant.tenantId
          })
          .then(function(tenantUser) {
            tenantUser.$skills = [];

            tenantUser.$groups = TenantUserGroups.query({
              memberId: tenantUser.id,
              tenantId: Session.tenant.tenantId
            });

            //cover the case for new tenant users
            vm.setDefaultActiveExtension(tenantUser);

            return tenantUser.save();
          });
      };

      vm.setDefaultActiveExtension = function (tenantUser) {
        if(tenantUser.extensions && angular.isUndefined(tenantUser.activeExtension) && tenantUser.extensions.length > 0) {
          tenantUser.activeExtension = tenantUser.extensions[0];
        }
      };

      vm.canSaveUser = function(tenantUser) {
        return $scope.scenario() !== 'invite:existing:user' &&

          (tenantUser.$user.isNew() ||

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

        var userSave = vm.canSaveUser($scope.selectedTenantUser) ?
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
    }
  ]);
