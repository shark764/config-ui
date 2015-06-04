'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
      $scope.login = function () {
        AuthService.login(
          $scope.username,
          $scope.password
        ).then(function () {
          $location.path('/');
        }, function () {
        });
      };
    }
  ]);