'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetTenantStatus', ['Tenant', 'BulkAction',
    function (Tenant, BulkAction) {
      return {
        restrict: 'AE',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/tenants/bulkActions/tenantStatus/setTenantStatusBulkAction.html',
        link: function ($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          
          if(bulkActionExecutor){
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.bulkAction.apply = function(tenant) {
            var tenantCopy = new Tenant();
            tenantCopy.id = tenant.id;
            tenantCopy.active = $scope.active;
            return tenantCopy.save().then(function(tenantCopy) {
              angular.copy(tenantCopy, tenant);
              tenant.checked = true;
              return tenant;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };
        }
      };
    }
  ]);
