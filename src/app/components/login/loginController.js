'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', function ($scope, $location, AuthInterceptorService) {
    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
      $scope.setCurrentUser(AuthInterceptorService.login($scope.username, $scope.password));
      $location.path('/');
    };
  });
