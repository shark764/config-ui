'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'UserService', function ($scope, UserService) {
    $scope.showModal = false;
    $scope.showError = false;
    $scope.errorMsg = "Input required data";


  	UserService.query(function(data){
      $scope.users = data.result;
    });

    $scope.createUser = function(){
    	$scope.showModal = true;
    }

  	$scope.saveCreateUser = function($data){

      if($data) {
        UserService.save({
          "role": $data.role,
          "email": $data.email,
          "password": $data.password,
          "displayName": $data.displayName,
          "firstName": $data.firstName,
          "lastName": $data.lastName,
          "state": $data.state,
          "externalId": $data.externalId,
          "createdBy": $data.createdBy,
          "status": ($data.status == "true" ? true : false)
        }).$promise.then(
          function (data){
            console.log("Success");
            console.log(data);
            $scope.showError = false;
            $scope.showModal = false;
          },
          function (data) {
            console.log("Error")
            console.log(data);
            $scope.showError = true;
            $scope.errorMsg = data.statusText;
          }
        )
      } else {
        $scope.showError = true;
      }
    };

  }]);
