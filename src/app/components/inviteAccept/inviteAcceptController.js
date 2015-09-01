'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'User', '$state', '$stateParams', 'invitedUser', 'AuthService', 'TenantUser', 'Alert', 'Session', 'UserPermissions',
    function ($scope, User, $state, $stateParams, invitedUser, AuthService, TenantUser, Alert, Session, UserPermissions) {
      $scope.user = invitedUser;
      $scope.loading = false;

      $scope.showSignupForm = true;

      $scope.save = function(){
        $scope.loading = true;
        
        //Since password isn't returned from the API and would be clobbered after saving, need to store it explicitly
        $scope.newPassword = $scope.user.password;
        
        delete $scope.user.status; //Users don't have permission to update their own status
        delete $scope.user.roleId; //Users cannot update their own roles
        $scope.user.save()
          .then($scope.signupSuccess, $scope.signupFailure);
      };
      
      $scope.signupSuccess = function(user){
        //resetting the password here since on save, user comes back without the password and
        //the password field on the form would show as having a validation error (where password is null)
        user.password = $scope.newPassword;
        
        TenantUser.update({
          tenantId: $stateParams.tenantId,
          id: $stateParams.userId,
          status: 'accepted'
        }, $scope.acceptSuccess, $scope.acceptFailure);
      };
      
      $scope.signupFailure = function(){
        Alert.error('Sorry, your details could not be updated at this time');
        $scope.loading = false;
      };
      
      $scope.acceptSuccess = function(){
        Session.setToken(null);
        AuthService.login($scope.user.email, $scope.newPassword).then(function(){
          if (UserPermissions.hasPermissionInList(['PLATFORM_MANAGE_ALL_TENANTS_ENROLLMENT', 'VIEW_ALL_USERS', 'MANAGE_ALL_USER_EXTENSIONS', 'MANAGE_ALL_GROUP_USERS', 'MANAGE_ALL_USER_SKILLS', 'MANAGE_ALL_USER_LOCATIONS', 'MANAGE_TENANT_ENROLLMENT'])){
            $state.transitionTo('content.management.users', {id: $stateParams.userId, messageKey: 'invite.accept.autologin.success'});
          } else {
            $state.transitionTo('content.userprofile', {messageKey: 'invite.accept.autologin.success'});
          }
        }, function(){
          $state.transitionTo('login', {messageKey: 'invite.accept.autologin.fail'});
        });
      };
      
      $scope.acceptFailure = function(){
        Alert.error('Sorry, there was an error accepting your invitation.');
        $scope.loading = false;
      };
    }
  ]);
