'use strict';

angular.module('liveopsConfigPanel')
  .directive('baCancelInvite', ['BulkAction', 'Session',
    function (BulkAction, Session) {
      return {
        restrict: 'E',
        scope: true,
        require: '^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/cancelInvitation/cancelInviteBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          bulkActionExecutor.register($scope.bulkAction);
          
          $scope.bulkAction.apply = function apply(tenantUser) {
            tenantUser.status = 'pending';
            
            return tenantUser.save({
              tenantId: Session.tenant.tenantId
            });
          };
          
          $scope.bulkAction.doesQualify = function doesQualify(tenantUser) {
            return tenantUser.status === 'invited';
          };
        }
      };
    }
  ]);
