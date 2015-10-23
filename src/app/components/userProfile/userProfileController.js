'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$q', '$scope', 'AuthService', 'Session', 'User', 'TenantUser',
    function ($q, $scope, AuthService, Session, User, TenantUser) {

      $scope.tenantUser = TenantUser.get({
        id: Session.user.id,
        tenantId: Session.tenant.tenantId
      });

      $scope.submit = function () {
        delete $scope.tenantUser.status; //User cannot edit their own status
        delete $scope.tenantUser.roleId; //User cannot edit their own platform roleId

        var password = $scope.tenantUser.$user.password;
        return $scope.tenantUser.$user.save(function(user) {
          Session.setUser(user);

          if($scope.userForm.password.$dirty) {
            var token = AuthService.generateToken(user.email, password);
            Session.setToken(token);
          }

          $scope.userForm.password.$setPristine();
        });
      };
    }
  ]);
