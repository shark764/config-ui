'use strict';

angular.module('liveopsConfigPanel')
.directive('newUser', function() {
  return {

    templateUrl: 'app/components/users/newUser/newUser.html',
    controller:  function ($scope) {
      $scope.data = {};
      $scope.data.status = false;

      $scope.ok = function(){
        $scope.saveUser($scope.data, "653f1bf0-0095-11e5-b2a6-2da9f0004fdd");
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