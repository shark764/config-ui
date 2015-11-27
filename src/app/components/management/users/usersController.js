'use strict';

angular.module('liveopsConfigPanel')
  .controller('UsersController', ['$scope', '$window', '$parse', 'User', 'Session', 'AuthService', 'userTableConfig', 'Alert', 'flowSetup', 'BulkAction', '$q', '$location', 'lodash', 'TenantUser', 'TenantRole', 'queryCache', 'UserPermissions', 'PlatformRole', 'TenantUserGroups', 'Modal',
    function ($scope, $window, $parse, User, Session, AuthService, userTableConfig, Alert, flowSetup, BulkAction, $q, $location, _, TenantUser, TenantRole, queryCache, UserPermissions, PlatformRole, TenantUserGroups, Modal) {
      var vm = this;
      $scope.forms = {};
      $scope.Session = Session;
      $window.flowSetup = flowSetup;
      $scope.userTableConfig = userTableConfig;

      $scope.scenario = function () {
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

      $scope.fetchTenantUsers = function () {
        return TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchTenantRoles = function () {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchPlatformRoles = function () {
        return PlatformRole.cachedQuery();
      };

      $scope.create = function () {
        $scope.selectedTenantUser = new TenantUser();
        $scope.selectedTenantUser.$user = new User();
      };

      vm.saveTenantUser = function saveTenantUser () {

        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function (tenantUser) {
          tenantUser.$skills = [];

          tenantUser.$groups = TenantUserGroups.query({
            memberId: tenantUser.id,
            tenantId: Session.tenant.tenantId
          });

          return tenantUser;
        });
      };

      vm.canSaveUser = function(tenantUser) {
        return tenantUser.$user.isNew() ||
          (UserPermissions.hasPermission('PLATFORM_MANAGE_USER_ACCOUNT') &&
            Session.user.id === $scope.selectedTenantUser.$user.id) ||
          UserPermissions.hasPermission('PLATFORM_MANAGE_ALL_USERS');
      };

      vm.canSaveTenantUser = function(tenantUser) {
        return tenantUser.isNew() ||
          (UserPermissions.hasPermissionInList([
            'PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT',
            'MANAGE_TENANT_ENROLLMENT'
          ]));
      };

      $scope.submit = function () {
        if ($scope.selectedTenantUser.$user.isNew()) {
          $scope.selectedTenantUser.$user.email = $scope.selectedTenantUser.email;
        }

        var userSave = vm.canSaveUser($scope.selectedTenantUser) ?
          $scope.selectedTenantUser.$user.save :
          $q.when;

        var tenantUserSave = vm.canSaveTenantUser($scope.selectedTenantUser) ?
          vm.saveTenantUser :
          $q.when;

        return userSave.call($scope.selectedTenantUser.$user)
          .then(tenantUserSave)
      };

      $scope.resend = function () {
        $scope.selectedTenantUser.status = 'invited';

        return $scope.selectedTenantUser.save({
          tenantId: Session.tenant.tenantId
        }).then(function () {
          Alert.success('Invite Sent');
        }, function () {
          Alert.error('Error occured. Invite not sent.');
        });
      };

      $scope.expireTenantUser = function () {
        Modal.showConfirm({
          message: 'This will prevent the user from accepting their invitation. Continue?',
          okCallback: function () {
            $scope.selectedTenantUser.status = 'pending';

            $scope.selectedTenantUser.save({
              tenantId: Session.tenant.tenantId
            }).then(function () {
              Alert.success('Invitation revoked');
            }, function () {
              Alert.error('An error occured. Invite remains active.');
            });
          }
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      //TODO revisit this.
      $scope.$on('email:validator:found', function (event, tenantUser) {
        $scope.selectedTenantUser = tenantUser;
      });
    }
  ]);
