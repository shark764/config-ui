'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetCxEngageAuth', ['BulkAction', 'Session', 'cxEngageAuthOptions', 'TenantUser', 'bulkEditUserAuth',
    function(BulkAction, Session, cxEngageAuthOptions, TenantUser, bulkEditUserAuth) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/management/users/bulkActions/cxEngageAuth/setCxEngageAuthBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          var TenantUserSvc = new TenantUser ();

          $scope.bulkAction = new BulkAction();
          // by using bulkEditUserAuth as the argument/flag, set the user-facing
          // default Cx Enabled status to be blank
          $scope.cxEngageAuthOptions = cxEngageAuthOptions(bulkEditUserAuth);
          $scope.noPassword = $scope.cxEngageAuthOptions[0].value;

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function apply(tenantUser) {
            tenantUser.noPassword = $scope.noPassword;
            tenantUser = TenantUserSvc.removePropsBeforeSave(tenantUser);

            return tenantUser.save({
              tenantId: Session.tenant.tenantId,
            });
          };
        }
      };
    }
  ]);
