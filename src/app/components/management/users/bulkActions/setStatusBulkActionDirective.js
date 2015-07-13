'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetStatus', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/setStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.execute = function(user) {
            user.status = $scope.status;
            return user;
          };
        }
      };
    }
  ]);