'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'UserService', function ($scope, UserService) {
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

  }]);
