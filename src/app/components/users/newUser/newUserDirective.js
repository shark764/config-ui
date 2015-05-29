'use strict';

angular.module('liveopsConfigPanel')
.directive('newUser', ['UserService', function(UserService) {
  return {

    templateUrl: 'app/components/users/newUser/newUser.html',

    scope: {
      'users' : '=',
      'showModal' : '='
    },

    link:  function ($scope) {
      $scope.defaultUser = function(){
        return {
          status: false,
          state: 'Offline',
          firstName: '',
          lastName: ''
        };
      };
      $scope.user = $scope.defaultUser();


      $scope.$watch('user.firstName', function() {
        $scope.updateDisplayName();
      });

      $scope.$watch('user.lastName', function() {
        $scope.updateDisplayName();
      });

      $scope.updateDisplayName = function(){
        if (! $scope.createUserForm.displayName.$touched){
          var firstName = ($scope.user.firstName ? $scope.user.firstName : '');
          var lastName = ($scope.user.lastName ? $scope.user.lastName : '');
          var name = firstName + ' ' + lastName;
          $scope.user.displayName =  name.trim();
        }
      };

      $scope.ok = function(){
        UserService.save($scope.user, function (data) {
          $scope.users.push(data.result);
          $scope.showModal = false;
        });
      };

      // Clears form upon cancel
      $scope.cancel = function(){
        $scope.user = $scope.defaultUser();
        $scope.showError = false;
        $scope.showModal = false;
      };
    }
  };
}]);
