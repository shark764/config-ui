'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserProfileController', ['$scope', 'Session', 'User', 'TenantUserProfile', 'TenantUserSkill', 'TenantUserGroups', 'Alert', '$translate',
    function ($scope, Session, User, UserProfile, TenantUserSkill, TenantUserGroups, Alert, $translate) {

      $scope.tenantUser = UserProfile.get({
        id: Session.user.id,
        tenantId: Session.tenant.tenantId
      });
      
      $scope.submit = function () {
        var promise;
        if($scope.extensionForm.$dirty) {
          var user = $scope.tenantUser.$user;
          promise = $scope.tenantUser.save({
            tenantId: Session.tenant.tenantId
          }).then(function(tenantUser) {
            tenantUser.$user = user;
            tenantUser.id = user.id;
            return tenantUser.$user.save();
          });
        } else {
          promise = $scope.tenantUser.$user.save();
        }
        
        promise.then(function(user) {
          Alert.success($translate.instant('user.profile.save.success'));
          // $scope.tenantUserForm.$setPristine();
          // $scope.tenantUserForm.$setUntouched();
          Session.setUser(user);
        }, function() {
          Alert.error($translate.instant('user.profile.save.fail'));
        });
      };
    }
  ]);