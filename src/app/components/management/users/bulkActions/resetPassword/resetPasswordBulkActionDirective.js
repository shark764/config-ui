'use strict';

angular.module('liveopsConfigPanel')
  .directive('baResetPassword', ['User',
    function (User) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/management/users/bulkActions/resetPassword/resetPasswordBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(user) {
            var copyUser = new User();
            copyUser.id = user.id;
            copyUser.password = $scope.password;
            return copyUser.save().then(function(userCopy) {
              angular.copy(userCopy, user);
              user.checked = true;
              return user;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.password = null;
          };
        }
      };
    }
  ]);
