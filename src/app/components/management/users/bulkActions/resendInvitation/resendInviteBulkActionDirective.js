'use strict';

angular.module('liveopsConfigPanel')
  .directive('baResendInvite', ['BulkAction', 'Session',
    function (BulkAction, Session) {
      return {
        restrict: 'E',
        scope: true,
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/resendInvitation/resendInviteBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          
          if(bulkActionExecutor){
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.bulkAction.apply = function apply(tenantUser) {
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
