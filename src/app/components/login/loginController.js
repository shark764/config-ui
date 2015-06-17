'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService',
    function ($rootScope, $scope, $state, AuthService) {
      $scope.loginStatus = { $$state : {status: 1} };

      $scope.login = function () {
        $scope.loginStatus = AuthService.login($scope.username, $scope.password)
          .then(function () {
            $state.transitionTo('content.management.users');
            $rootScope.$broadcast('login:success');
          }, function(response){
            if(response.status === 401) {
              $scope.error = 'Invalid username and password';
              return;
            }
          });
      };
    }
  ]);
