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
          $scope.bulkAction.apply = function(tenantUser) {
            var newUser = new User();
            newUser.id = tenantUser.id;
            newUser.password = $scope.password;
            return newUser.save().then(function(user) {
              angular.copy(user, tenantUser.$user);
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
