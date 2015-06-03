'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$scope', '$location', 'AuthService', 'Session',
    function ($scope, $location, AuthService, Session) {
      $scope.login = function () {
        AuthService.login(
          $scope.username,
          $scope.password
        ).then(function (response) {
          Session.set(response.user, response.token);
          $location.path('/');
        }, function (response) {
          //TODO validation error
        });
      };
    }
  ]);