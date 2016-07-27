'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', '$translate', 'AuthService', 'Session', 'User', 'TenantUser',
    function($scope, $translate, AuthService, Session, User, TenantUser) {

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
            var token = AuthService.generateToken(user.email, password);
            Session.setToken(token);
          }

          $scope.userForm.password.$setPristine();
        });
      };
    }
  ]);
