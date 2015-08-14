'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'User', '$state', '$stateParams', 'invitedUser', 'invitedTenantUser', 'AuthService', 'TenantUser', 'Alert', 'Session',
    function ($scope, User, $state, $stateParams, invitedUser, invitedTenantUser, AuthService, TenantUser, Alert, Session) {
      $scope.user = invitedUser;
      
      if (invitedTenantUser.status != 'invited'){
        Session.setToken(null);
        $state.transitionTo('login', {messageKey: 'invite.accept.alreadyAccepted'});
      }
      
      if (invitedUser.status === 'enabled'){
        TenantUser.update({
          tenantId: $stateParams.tenantId,
          id: $stateParams.userId,
          status: 'accepted'
        }, function(){
          $state.transitionTo('login', {messageKey: 'invite.accept.success'});
        }, function(){
          $scope.error = 'Sorry, there was an error accepting your invitation';
        });
      } else if (invitedUser.status === 'pending'){
        $scope.showSignupForm = true;
      }
      
      $scope.save = function(){
        $scope.loading = true;
        
        //Since password isn't returned from the API and would be clobbered after saving, need to store it explicitly
        $scope.newPassword = $scope.user.password;
        
        $scope.user.save()
          .then($scope.signupSuccess, $scope.signupFailure)
          .finally(function(){
            $scope.loading = false;
          });
      };
      
      $scope.signupSuccess = function(){
        AuthService.login($scope.user.email, $scope.newPassword).then($scope.loginSuccess, $scope.loginFailure);
      };
      
      $scope.signupFailure = function(){
        Alert.error('Sorry, your details could not be updated at this time');
      };
      
      $scope.loginSuccess = function(){
        TenantUser.update({
          tenantId: $stateParams.tenantId,
          id: $stateParams.userId,
          status: 'accepted'
        }, function(){
          $state.transitionTo('content.management.users', {id: $stateParams.userId});
        }, function(){
          Alert.error('Sorry, there was an error accepting your invitation');
        });
      };
      
      $scope.loginFailure = function(){
        Alert.error('Sorry, there was an error signing you in.');
      };
    }
  ]);