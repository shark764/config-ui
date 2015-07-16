'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetStatus', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/userStatus/setStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(user) {
            var userCopy = angular.copy(user);
            userCopy.status = $scope.status;
            return userCopy.save().then(function(userCopy) {
              angular.copy(userCopy, user);
              user.checked = true;
              return user;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.status = false;
          };
        }
      };
    }
  ]);
