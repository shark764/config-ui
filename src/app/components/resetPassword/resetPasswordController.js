'use strict';

angular.module('liveopsConfigPanel')
  .controller('ResetPasswordController', ['$scope', '$state', '$translate', 'ResetPassword', 'Session', '$location', 'legalLinkCX', 'legalLinkMitel', 'userToReset',
  function($scope, $state, $translate, ResetPassword, Session, $location, legalLinkCX, legalLinkMitel, userToReset) {
    $scope.resetMessage = $translate.instant('value.passwordResetMessage', {user: userToReset.getDisplay()});

    $scope.checkValidity = function() {
      if ($scope.newPass !== $scope.confirmPass) {
        $scope.resetForm.confirmPassField.$setValidity('passwordMatch', false);
        return;
      }
      $scope.resetForm.confirmPassField.$setValidity('passwordMatch', true);
      $scope.reset();
    };

    $scope.reset = function() {
      $scope.loading = true;
      ResetPassword.setNewPassword(userToReset.id, $scope.newPass)
        .then(function() {
          $state.go('login', {
            messageKey: 'details.password.changeSuccess'
          });
        })
        .catch(function(err) {
          if (err.data.error.message === 'bad request parameters') {
            $scope.error = err.data.error.attribute.password.capitalize();
          }
          $scope.loading = false;
        });
    };

    $scope.createURL = function () {
      var mitelUrl = 'mitel';
      if ($location.absUrl().indexOf(mitelUrl) !== -1) {
        $scope.legalLinkURL = legalLinkMitel;
      } else {
        $scope.legalLinkURL = legalLinkCX;
      }
    }

  }]);
