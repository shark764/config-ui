'use strict';

angular.module('liveopsConfigPanel')
  .directive('baResetPassword', [
    function () {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/resetPassword/resetPasswordBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(user) {
            var userCopy = angular.copy(user);
            userCopy.password = $scope.bulkAction.password;
            return userCopy.save().then(function(userCopy) {
              angular.copy(userCopy, user);
              user.checked = true;
              return user;
            });
          };
        }
      };
    }
  ]);
