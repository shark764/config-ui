'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetTenantStatus', ['Tenant',
    function (Tenant) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/configuration/tenants/bulkActions/tenantStatus/setTenantStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(tenant) {
            var tenantCopy = new Tenant();
            tenantCopy.id = tenant.id;
            tenantCopy.status = $scope.status;
            return tenantCopy.save().then(function(tenantCopy) {
              angular.copy(tenantCopy, tenant);
              tenant.checked = true;
              return tenant;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.status = false;
          };
        }
      };
    }
  ]);
