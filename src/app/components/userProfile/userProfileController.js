'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', '$translate', '$q', 'AuthService', 'Session', 'User', 'TenantUser', 'Token',
    function($scope, $translate, $q, AuthService, Session, User, TenantUser, Token) {

      $scope.resettingPassword = false;

      $scope.tenantUser = TenantUser.get({
        id: Session.user.id,
        tenantId: Session.tenant.tenantId
      });

      $scope.tenantUser.$promise.then(function(user) {
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
      });

      $scope.submit = function() {
        delete $scope.tenantUser.status; //User cannot edit their own status
        delete $scope.tenantUser.roleId; //User cannot edit their own platform roleId

        var password = $scope.tenantUser.$user.password;
        return $scope.tenantUser.$user.save(function(user) {
          Session.setUser(user);

          if ($scope.userForm.password.$dirty) {
            return $q.when(AuthService.generateToken(user.email, password, Token)).then(function (tokenResponse) {
              Session.setToken(tokenResponse.token);
              $scope.userForm.password.$setPristine();
              $scope.userForm.currentPassword.$setPristine();
              $scope.resettingPassword = false;
            });
          }

        });
      };
    }
  ]);
