'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', '$translate', '$q', 'AuthService', 'Session', 'User', 'TenantUser', 'Token', 'Me', 'Integration',
    function($scope, $translate, $q, AuthService, Session, User, TenantUser, Token, Me, Integration) {

      function setDefaultTenant (defaultTenantId, tenantList) {
        if (defaultTenantId !== undefined && tenantList !== undefined) {
            if (defaultTenantId) {
              $scope.tenantUser.$user.defaultTenant = defaultTenantId;
            } else {
              $scope.tenantUser.$user.defaultTenant = tenantList[0].tenantId;
            }
        }
      }

      if (Session.tenant.tenantId !== "") {
          $scope.tenantIntegrations = Integration.cachedQuery({
            tenantId: Session.tenant.tenantId
          }, 'Intergration', true);
      }

      $scope.hasTwilioIntegration = false;

      if ($scope.tenantIntegrations) {
          $scope.tenantIntegrations.$promise.then(function(response) {
            // determine whether or not there are active verint and twilio extensions
            _.forEach(response, function (integration) {
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
      }

      var activeTenants = Me.cachedQuery();
      activeTenants.$promise.then(function (response) {
        $scope.userTenantList = response;
      });

      $scope.resettingPassword = false;

      if (Session.tenant.tenantId !== "") {
        $scope.tenantUser = TenantUser.get({
          id: Session.user.id,
          tenantId: Session.tenant.tenantId
        });
      } else {
        $scope.userData = User.get({
          id: Session.user.id
        });
      }

      if ($scope.tenantUser !== undefined) {
          $scope.tenantUser.$promise.then(function(user) {
            $scope.userData = user.$user;
            if (user.supervisorId === null) {
              $scope.noSupervisor = true;
            } else {
              TenantUser.get({
                id: user.supervisorId,
                tenantId: Session.tenant.tenantId
              }).$promise.then(function(supervisor) {
                $scope.supervisorName = supervisor.getDisplay();
              });
            }

            if (user.$user.defaultTenant)  {
              setDefaultTenant(user.$user.defaultTenant, $scope.userTenantList);
            }
          });
      }

      $scope.submit = function() {
        delete $scope.tenantUser.status; //User cannot edit their own status
        delete $scope.tenantUser.roleId; //User cannot edit their own platform roleId
        delete $scope.tenantUser.platformStatus; //User cannot edit their own platform status

        // after submit, new password remains in password variable
        var password = $scope.tenantUser.$user.password;
        return $scope.tenantUser.$user.save(function(user) {
          Session.setUser(user);
          if ($scope.userForm.newPassword.$dirty) {
            return $q.when(AuthService.generateToken(user.email, password, Token)).then(function (tokenResponse) {
              Session.setToken(tokenResponse);
              $scope.userForm.newPassword.$setPristine();
              $scope.userForm.currentPassword.$setPristine();
              $scope.resettingPassword = false;
            });
          }

          if (
            _.has(user, '$user.defaultTenant.tenantId') &&
            user.$user.defaultTenant.tenantId
          ) {
            setDefaultTenant(user.$user.defaultTenant.tenantId, $scope.userTenantList);
          }

        });
      };
    }
  ]);
