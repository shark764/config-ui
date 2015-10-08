'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService', '$stateParams', '$translate', 'Alert', 'TenantUser', '$filter', 'Session', 'UserPermissions',
    function ($rootScope, $scope, $state, AuthService, $stateParams, $translate, Alert, TenantUser, $filter, Session, UserPermissions) {
      var self = this;
      
      $scope.loginStatus = { $$state : {status: 1} };

      $scope.login = function () {
        $scope.error = null;

        $scope.loginStatus = AuthService.login($scope.username, $scope.password)
          .then(function (response) {
            $scope.loggingIn = true;
            $rootScope.$broadcast('login:success');
            if ($stateParams.tenantId){
              var tenantUser = new TenantUser({
                status: 'accepted',
                userId: response.data.result.userId
              });
              
              tenantUser.save({
                tenantId: $stateParams.tenantId
              }).then(self.inviteAcceptSuccess, self.inviteAcceptFail);
            } else {
              if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])){
                $state.go('content.management.users');
              } else {
                $state.go('content.userprofile');
              }
            }
          }, function(response){
            if(response.status === 401) {
              $scope.error = 'Invalid username and password';
            }
          });
      };
      
      this.inviteAcceptSuccess = function(){
        //Update user info in Session
        AuthService.refreshTenants().then(function(){
          var newTenant = $filter('filter')(Session.tenants, {tenantId: $stateParams.tenantId}, true);
          if (newTenant.length >= 1){
            Session.setTenant(newTenant[0]);
          }
        });
        
        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])){
          $state.go('content.management.users', {messageKey: 'invite.accept.success'});
        } else {
          $state.go('content.userprofile', {messageKey: 'invite.accept.success'});
        }
      };
      
      this.inviteAcceptFail = function(){
        if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])){
          $state.go('content.management.users', {messageKey: 'invite.accept.existing.fail'});
        } else {
          $state.go('content.userprofile', {messageKey: 'invite.accept.existing.fail'});
        }
      };
      
      if ($stateParams.messageKey){
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
