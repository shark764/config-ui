'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$q', '$scope', 'Session', 'User', 'TenantUser', 'TenantUserSkill', 'TenantUserGroups', 'Alert', '$translate',
    function ($q, $scope, Session, User, TenantUser, TenantUserSkill, TenantUserGroups, Alert, $translate) {

      $scope.tenantUser = TenantUser.get({
        id: Session.user.id,
        tenantId: Session.tenant.tenantId
      });
      
      $scope.submit = function () {
        delete $scope.tenantUser.status; //User cannot edit their own status
        delete $scope.tenantUser.roleId; //User cannot edit their own platform roleId
        
        return $scope.tenantUser.$user.save(function(user) {
          Session.setUser(user);
          $scope.userForm.password.$setPristine()
        });
      };
    }
  ]);