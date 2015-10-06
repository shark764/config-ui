'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$q', '$scope', 'Session', 'User', 'TenantUserProfile', 'TenantUserSkill', 'TenantUserGroups', 'Alert', '$translate',
    function ($q, $scope, Session, User, UserProfile, TenantUserSkill, TenantUserGroups, Alert, $translate) {

      $scope.tenantUser = UserProfile.get({
        id: Session.user.id,
        tenantId: Session.tenant.tenantId
      });
      
      $scope.submit = function () {
        $scope.tenantUser.$user.save().then(function(user) {
          Alert.success($translate.instant('user.profile.save.success'));
          Session.setUser(user);
        }, function() {
          Alert.error($translate.instant('user.profile.save.fail'));
        });
      };
    }
  ]);