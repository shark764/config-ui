'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', function ($scope, $location, liveopsApiInterceptor) {
    $scope.username = '';
    $scope.password = '';

    $scope.login = function(){
      liveopsApiInterceptor.setCredentials($scope.username, $scope.password);
      $location.path('/');
    };
  });
