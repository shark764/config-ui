'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$rootScope', '$scope', '$location', 'AuthService',
    function ($rootScope, $scope, $location, AuthService) {
      $scope.login = function () {
        AuthService.login($scope.username, $scope.password)
          .then(function () {
            $location.path('/');
            $rootScope.$broadcast('Session:login');
          });
      };
    }
  ]);
