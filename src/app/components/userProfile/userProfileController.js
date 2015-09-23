'use strict';

angular.module('liveopsConfigPanel')
.controller('UserProfileController', ['$scope', 'Session', 'User', 'TenantUserSkills', 'TenantUserGroups', 'Alert', '$translate', function ($scope, Session, User, TenantUserSkills, TenantUserGroups, Alert, $translate) {
  $scope.user = User.get({id : Session.user.id});

  $scope.save = function() {
    delete $scope.user.status; //User cannot edit their own status
    delete $scope.user.roleId; //User cannot edit their own platform roleId
    
    $scope.user.save(function(result){
      Alert.success($translate.instant('user.profile.save.success'));
      Session.setUser(result);
      $scope.detailsForm.$setPristine();
      $scope.detailsForm.$setUntouched();
    }, function(){
      Alert.error($translate.instant('user.profile.save.fail'));
    });
  };

  $scope.fetchSkills = function () {
    if (!Session.tenant.tenantId) {
      return;
    }

    $scope.userSkills = TenantUserSkills.query({
      tenantId: Session.tenant.tenantId,
      userId: Session.user.id
    }, $scope.reset);
  };

  $scope.fetchGroups = function () {
    if (!Session.tenant.tenantId) {
      return;
    }

    $scope.userGroups = TenantUserGroups.query({
      tenantId: Session.tenant.tenantId,
      memberId: Session.user.id
    }, $scope.reset);
  };

  $scope.fetchSkills();
  $scope.fetchGroups();

}]);
