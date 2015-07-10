'use strict';

angular.module('liveopsConfigPanel')
  .directive('baResetPassword', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/resetPasswordBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.execute = function(user) {
            user.password = $scope.password;
            return user;
          }
        }
      };
    }
  ]);