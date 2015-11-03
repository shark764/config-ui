'use strict';

angular.module('liveopsConfigPanel')
  .directive('baInvite', ['BulkAction', 'Session',
    function (BulkAction, Session) {
      return {
        restrict: 'E',
        require: '^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/invite/inviteBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          bulkActionExecutor.register($scope.bulkAction);
          
          $scope.bulkAction.apply = function apply(tenantUser) {
            tenantUser.status = 'invited';
            
            return tenantUser.save({
              tenantId: Session.tenant.tenantId
            });
          };
          
          $scope.bulkAction.doesQualify = function doesQualify(tenantUser) {
            return tenantUser.status === 'pending';
          };
        }
      };
    }
  ]);
