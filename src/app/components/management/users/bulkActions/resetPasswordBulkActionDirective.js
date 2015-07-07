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
          $scope.bulkAction.action = function(user) {
            user.password = $scope.password;
            var promise = user.$update();
            return promise;
          }
        }
      };
    }
  ]);