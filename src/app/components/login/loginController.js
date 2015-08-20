'use strict';

angular.module('liveopsConfigPanel')
  .controller('LoginController', ['$rootScope', '$scope', '$state', 'AuthService', '$stateParams', '$translate', 'Alert',
    function ($rootScope, $scope, $state, AuthService, $stateParams, $translate, Alert) {
      $scope.loginStatus = { $$state : {status: 1} };

      $scope.login = function () {
        $scope.error = null;

        $scope.loginStatus = AuthService.login($scope.username, $scope.password)
          .then(function () {

            $scope.loggingIn = true;

            $state.go('content.management.users').finally(function () {
              $scope.loggingIn = false;
            });

            $rootScope.$broadcast('login:success');
          }, function(response){
            if(response.status === 401) {
              $scope.error = 'Invalid username and password';
              return;
            }
          });
      };
      
      if ($stateParams.messageKey){
        Alert.info($translate.instant($stateParams.messageKey), '', {
          closeButton: true,
          showDuration: 0,
          hideDuration: 0,
          timeOut: 0,
          extendedTimeOut: 0
        });
      }
    }
  ]);
