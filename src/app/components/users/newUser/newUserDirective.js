'use strict';

angular.module('liveopsConfigPanel')
.directive('newUser', function() {
  return {

    templateUrl: 'app/components/users/newUser/newUser.html',

    link:  function ($scope) {
      $scope.data = {};
      $scope.data.status = false;

      $scope.ok = function(){
        $scope.saveUser($scope.data);
      };

      $scope.cancel = function(){
        $scope.data = [];
        $scope.showError = false;
        $scope.showModal = false;
      };

    }
  };
});