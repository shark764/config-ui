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
        
        $scope.tenantUser.$user.save().then(function(user) {
          Alert.success($translate.instant('user.profile.save.success'));
          Session.setUser(user);
        }, function() {
          Alert.error($translate.instant('user.profile.save.fail'));
        });
      };
    }
  ]);