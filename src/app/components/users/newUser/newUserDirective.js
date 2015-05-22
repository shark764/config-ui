'use strict';

angular.module('liveopsConfigPanel')
.directive('newUser', function() {
  return {

    templateUrl: 'app/components/users/newUser/newUser.html',
    controller:  function ($scope) {
      $scope.data = {};
      $scope.data.status = false;
      $scope.data.state = "Offline";

      $scope.ok = function(){
        $scope.createUser($scope.data);
      }

      $scope.cancel = function(){
        $scope.data = [];
        $scope.showError = false;
        $scope.showModal = false;
      }

    },
    controllerAs: 'newUserController'
  };
});