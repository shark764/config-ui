'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'User', '$state', '$stateParams', 'invitedUser',
    function ($scope, User, $state, $stateParams, invitedUser) {
      $scope.user = invitedUser;
      
      $scope.save = function(){
        $scope.loading = true;
        
        $scope.user.save()
          .then($scope.signupSuccess, $scope.signupFailure)
          .finally(function(){
            $scope.loading = false;
          });
      };
      
      $scope.signupSuccess = function(){
        AuthService.login($scope.user.email, $scope.user.password).then($scope.loginSuccess, $scope.loginFailure);
      };
      
      $scope.signupFailure = function(){
        Alert.error('Sorry, your details could not be updated at this time');
      };
      
      $scope.loginSuccess = function(){
        TenantUser.update({
          tenantId: $stateParams.tenantId,
          userId: $stateParams.userId,
          status: 'accepted'
        }, function(){
          $state.transitionTo('content.management.users', {id: $stateParams.userId});
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