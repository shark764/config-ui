'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService', '$stateParams', '$translate', 'Alert', 'TenantUser', '$filter', 'Session', 'UserPermissions',
    function($rootScope, $scope, $state, AuthService, $stateParams, $translate, Alert, TenantUser, $filter, Session, UserPermissions) {
      var self = this;

      $scope.idpLoginPageLogin = AuthService.idpLogin;

      $scope.loginStatus = {
        $$state: {
          status: 1
        }
      };

      $scope.toggleView = function () {
        $scope.passwordView = !$scope.passwordView;
        $scope.error = '';
      };

      function provideIdpErrorMessage (errorMessage) {
        $scope.error = errorMessage;
      }

      AuthService.getErrorMessageFunction (provideIdpErrorMessage);

      $scope.login = function(alternateToken) {
        // prevent the form from submitting if the user
        // is on the password view and hits the enter key
        if (!$scope.passwordView && !alternateToken) {
          return;
        }

        var alternateTokenVal = alternateToken || null;
        $scope.error = null;

        $scope.loginStatus = AuthService.login($scope.username, $scope.password, alternateTokenVal, $scope)
          .then(function(response) {
            $scope.loggingIn = true;
            $rootScope.$broadcast('login:success');
            if ($stateParams.tenantId) {
              TenantUser.update({
                tenantId: $stateParams.tenantId,
                id: response.data.result.userId,
                status: 'accepted'
              }, self.inviteAcceptSuccess, self.inviteAcceptFail);
            } else {
              if (UserPermissions.hasPermissionInList(['MANAGE_ALL_SKILLS', 'MANAGE_ALL_GROUPS'])) {
                $state.go('content.management.users');
              } else {
                $state.go('content.userprofile');
              }
            }
          }, function(response) {
            switch (response.status) {
              case 401:
                $scope.error = $translate.instant('login.error');
                break;
              default:
                $scope.error = $translate.instant('login.unexpected.error');
            }
          });
      };

      // providing this back to the auth service so that it can
      // be used from within the SSO login method
      AuthService.getLoginFunction($scope.login);

      this.inviteAcceptSuccess = function() {
        //Update user info in Session
        AuthService.refreshTenants().then(function() {
          var newTenant = $filter('filter')(Session.tenants, {
            tenantId: $stateParams.tenantId
          }, true);
          if (newTenant.length >= 1) {
            Session.setTenant(newTenant[0]);
          }
        });

        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])) {
          $state.go('content.management.users', {
            messageKey: 'invite.accept.success'
          });
        } else {
          $state.go('content.userprofile', {
            messageKey: 'invite.accept.success'
          });
        }
      };

      this.inviteAcceptFail = function() {
        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])) {
          $state.go('content.management.users', {
            messageKey: 'invite.accept.existing.fail'
          });
        } else {
          $state.go('content.userprofile', {
            messageKey: 'invite.accept.existing.fail'
          });
        }
      };

      if ($stateParams.messageKey) {
        Alert.info($translate.instant($stateParams.messageKey), '', {
          closeButton: true,
          showDuration: 0,
          hideDuration: 0,
          timeOut: 0,
          extendedTimeOut: 0
        });
      }
    }
  ]);
