'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'UserService', function ($scope, UserService) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = "Input required data";


  	UserService.query(function(data){
      $scope.users = data.result;
      $scope.selectedUserContext = {};
      
      $scope.selectUser = function(user) {
        $scope.selectedUserContext = {
          user: user
        };
        
        $scope.selectedUserContext.display = {
          firstName : user.firstName,
          lastName : user.lastName,
          displayName : user.displayName
        };
      };
    });

    $scope.showModalSection = function(){
    	$scope.showModal = true;
    }

  	$scope.createUser = function($data){
      $data.createdBy = $scope.Session.id;
      UserService.save($data)
      .$promise.then(
        $scope.successResponse,
        $scope.errorResponse
      );
    }

    $scope.successResponse = function($data) {
      $scope.showError = false;
      $scope.showModal = false;
    }

    $scope.errorResponse = function($data) {
      $scope.showError = true;
      $scope.errorMsg = $data.data.message;
    }
  }]);
