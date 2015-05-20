'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListController', ['$scope', 'UserService', function ($scope, UserService) {
    UserService.query(function(data){
      $scope.users = data.result;
    });
  }]);
