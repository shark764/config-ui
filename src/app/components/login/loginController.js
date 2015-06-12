'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService',
    function ($rootScope, $scope, $state, AuthService) {
      $scope.login = function () {
        $scope.error = '';
        AuthService.login($scope.username, $scope.password)
          .then(function (response) {
            if(response.data) {

              if(response.data.error && response.data.error.code == 401) {
                $scope.error = 'Invalid username and password';
                return;
              }

              $state.go('content.management.users');
              $rootScope.$broadcast('login:success');
            } else {
              $scope.error = "API returned no response. Please check console for more details and try again";
            }
          });
      };
    }
  ]);
