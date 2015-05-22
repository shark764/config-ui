'use strict';

angular.module('liveopsConfigPanel')
  .directive('newUser', function() {
    return {
      templateUrl: 'app/components/users/newUser/newUser.html',
      controller:  function ($scope) {

     	$scope.ok = function(){
     		console.log($scope.data);
    		$scope.saveCreateUser($scope.data);
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