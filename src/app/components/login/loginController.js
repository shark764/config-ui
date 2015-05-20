'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', function ($scope, $location, AuthService) {
    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
      $scope.setCurrentUser(AuthService.login($scope.username, $scope.password));
      $location.path('/');
    };
  });
