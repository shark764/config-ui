'use strict';

angular.module('liveopsConfigPanel')
  .directive('baInvite', ['BulkAction', 'Session',
    function(BulkAction, Session) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/invite/inviteBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function apply(tenantUser) {
            tenantUser.status = 'invited';
            delete tenantUser.invitationStatus;
            return tenantUser.save({
              tenantId: Session.tenant.tenantId
            });
          };

          $scope.bulkAction.doesQualify = function doesQualify(tenantUser) {
            return tenantUser.invitationStatus === 'pending';
          };
        }
      };
    }
  ]);
