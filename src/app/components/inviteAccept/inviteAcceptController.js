'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'User', '$state', '$stateParams', 'invitedUser', 'AuthService', 'TenantUser', 'Alert',
    function ($scope, User, $state, $stateParams, invitedUser, AuthService, TenantUser, Alert) {
      $scope.user = invitedUser;
      
      $scope.save = function(){
        $scope.loading = true;
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
      
      $scope.loginFailure = function(response){
        if(response.status === 401) {
          $scope.error = 'Invalid username and password';
          return;
        }
      };
    }
  ]);