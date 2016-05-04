'use strict';

angular.module('liveopsConfigPanel')
  .controller('ResetPasswordController', ['$scope', 'ResetPassword', 'Session', function($scope, ResetPassword, Session) {
    $scope.username = Session.user.displayName;

    $scope.checkValidity = function() {
      if ($scope.newPass !== $scope.confirmPass) {
        $scope.resetForm.confirmPassField.$setValidity('passwordMatch', false);
        return;
      }
      $scope.resetForm.confirmPassField.$setValidity('passwordMatch', true);
      $scope.reset();
    };

    $scope.reset = function() {
      ResetPassword.setNewPassword(Session.user.id, $scope.newPass)
        .then(function() {
          $scope.success = true;
        })
        .catch(function(err) {
          if (err.data.error.message === "bad request parameters") {
            $scope.error = err.data.error.attribute.password.capitalize();
          }
        });
    };

  }]);
