'use strict';

angular.module('liveopsConfigPanel')
  .controller('ForgotPasswordController', ['$scope', '$state', '$translate', '$location', 'legalLinkCX', 'legalLinkMitel', 'ResetPassword',
  function($scope, $state, $translate, $location,legalLinkCX, legalLinkMitel, ResetPassword) {

    $scope.resetPassword = function() {
      $scope.loading = true;
      ResetPassword.userInitiateReset($scope.email)
        .then(function() {
          $state.go('login', {
            messageKey: 'forgotPassword.emailSent'
          });
        })
        .catch(function() {
          $scope.loading = false;
          $scope.error = $translate.instant('login.error.unexpected');
        });
    };

    $scope.createURL = function () {
      var mitelUrl = 'mitel';
      if ($location.absUrl().indexOf(mitelUrl) !== -1) {
        $scope.legalLinkURL = legalLinkMitel;
      } else {
        $scope.legalLinkURL = legalLinkCX;
      }
    };

  }]);
