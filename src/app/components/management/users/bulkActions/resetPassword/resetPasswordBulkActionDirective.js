'use strict';

angular.module('liveopsConfigPanel')
  .directive('baResetPassword', ['BulkAction', 'Session', 'ResetPassword',
    function(BulkAction, Session, ResetPassword) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/resetPassword/resetPasswordBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function apply(tenantUser) {
            ResetPassword.initiateReset(tenantUser.id);
          };
        }
      };
    }
  ]);
