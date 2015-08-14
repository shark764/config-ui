'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'User', '$state', '$stateParams', 'invitedUser', 'invitedTenantUser', 'AuthService', 'TenantUser', 'Alert', 'Session', '$timeout',
    function ($scope, User, $state, $stateParams, invitedUser, invitedTenantUser, AuthService, TenantUser, Alert, Session, $timeout) {
      $scope.user = invitedUser;
      $scope.loading = false;
      
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
          .then($scope.signupSuccess, $scope.signupFailure);
      };
      
      $scope.acceptSuccess = function(){
        AuthService.login($scope.user.email, $scope.newPassword).then(function(){
          $state.transitionTo('content.management.users', {id: $stateParams.userId});
        }, function(){
          Alert.error('Sorry, there was an error logging you in!');
          $scope.loading = false;
        });
      };
      
      $scope.signupFailure = function(){
        Alert.error('Sorry, your details could not be updated at this time');
        $scope.loading = false;
      };
      
      $scope.signupSuccess = function(){
        TenantUser.update({
          tenantId: $stateParams.tenantId,
          id: $stateParams.userId,
          status: 'accepted'
        }, $scope.acceptSuccess, $scope.acceptFailure);
      };
      
      $scope.acceptFailure = function(){
        Alert.error('Sorry, there was an error accepting your invitation.');
        $scope.loading = false;
      };
    }
  ]);