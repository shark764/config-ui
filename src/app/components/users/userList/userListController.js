'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'UserService', function ($scope, UserService) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = "Input required data";


  	UserService.query(function(data){
      $scope.users = data.result;
    });

    $scope.showModalSection = function(){
    	$scope.showModal = true;
    }

    $scope.saveUser = function($data, $userId) {

      if ( $userId == "" || typeof $userId === 'undefined' ){
        $userId = null;
      }
      if ($userId == null){
        $data.createdBy = $scope.Session.id;
        $scope.createUser($data);
      } else {
        $data.updatedBy = $scope.Session.id;
        $scope.updateUser($userId, $data);
      }

    }

  	$scope.createUser = function($data){
      UserService.save($data)
      .$promise.then(
        $scope.successResponse,
        $scope.errorResponse
      );
    }

    $scope.updateUser = function($userId, $data){
      UserService.update({ id:$userId }, $data)
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
      $scope.errorMsg = data.statusText;
    }
  }]);
