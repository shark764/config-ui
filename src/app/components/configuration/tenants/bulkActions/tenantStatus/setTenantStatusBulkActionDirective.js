'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetTenantStatus', ['$rootScope', 'Tenant', 'BulkAction', 'statuses',  'loEvents', function($rootScope, Tenant, BulkAction, statuses, loEvents) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/tenants/bulkActions/tenantStatus/setTenantStatusBulkAction.html',
        link: function($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          $scope.statuses = statuses();
          var TenantSvc = new Tenant();

          if (bulkActionExecutor) {
            bulkActionExecutor.register($scope.bulkAction);
          }

          $scope.bulkAction.apply = function(tenant) {
            var tenantCopy = new Tenant();
            tenantCopy.id = tenant.id;
            tenantCopy.active = $scope.active;
            return tenantCopy.save().then(function(tenantCopy) {
              angular.copy(tenantCopy, tenant);
              tenant.checked = true;
              TenantSvc.updateSessionTenantProps(tenant, 'active', 'tenantActive');
              $rootScope.$broadcast(loEvents.session.tenants.updated);
              return tenant;
            });
          };

          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };

          $scope.bulkAction.reset();
        }
      };
    }
  ]);
