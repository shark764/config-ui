'use strict';

angular.module('liveopsConfigPanel')
  .controller('InviteAcceptController', ['$scope', 'userInviteResult', 'User', '$state', '$stateParams',
    function ($scope, userInviteResult, User, $state, $stateParams) {
      if (userInviteResult === 'true'){
        $scope.inviteSuccess = true;
        $scope.user = User.get({id: $stateParams.userId});
      } else {
        $scope.inviteError = userInviteResult;
      }
      
      $scope.save = function(){
        $scope.loading = true;
        
        $scope.user.save().then(function(){
          $state.transitionTo('content.management.users', {id: invitedUser.id});
        }, function(){
          $scope.loading = false;
          Alert.error('Sorry, your details could not be updated at this time');
        })
      };
    }
  ]);