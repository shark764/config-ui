'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'UserService', function ($scope, UserService) {
    UserService.query(function(data){
      $scope.users = data.result;
      
      if($scope.users) {
        $scope.selectedUser = $scope.users[0];
        $scope.selectedUser.display = {
          firstName : $scope.selectedUser.firstName,
          lastName : $scope.selectedUser.lastName,
          displayName : $scope.selectedUser.displayName
        }
      }
      
      $scope.selectUser = function(user) {
        $scope.selectedUser = user;
      }
    });

  }]);
