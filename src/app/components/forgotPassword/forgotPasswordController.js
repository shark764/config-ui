'use strict';

angular.module('liveopsConfigPanel')
  .controller('ForgotPasswordController', ['$scope', '$state', '$translate', 'ResetPassword', function($scope, $state, $translate, ResetPassword) {

    $scope.resetPassword = function() {
      $scope.loading = true;
      ResetPassword.userInitiateReset($scope.email)
        .then(function() {
          $state.go('login', {
            messageKey: 'details.password.emailSent'
          });
        })
        .catch(function() {
          $scope.loading = false;
          $scope.error = $translate.instant('login.unexpected.error');
        });
    }

  }]);
