'use strict';

angular.module('liveopsConfigPanel')
  .controller('UserListCtrl', ['$scope', 'UserService', function ($scope, UserService) {
    UserService.query(function(data){
      $scope.users = data.result;
    });
  }]);
