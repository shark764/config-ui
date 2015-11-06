'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetIntegrationStatus', ['Integration', 'Session', 'BulkAction',
    function (Integration, Session, BulkAction) {
      return {
        restrict: 'AE',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/configuration/integrations/bulkActions/integrationStatus/setIntegrationStatusBulkAction.html',
        link: function ($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();
          
          if(bulkActionExecutor){
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.bulkAction.apply = function(integration) {
            var integrationCopy = new Integration();
            integrationCopy.id = integration.id;
            integrationCopy.tenantId = Session.tenant.tenantId;
            integrationCopy.active = $scope.active;
            integrationCopy.properties = integration.properties;
            return integrationCopy.save().then(function(integrationCopy) {
              angular.copy(integrationCopy, integration);
              integration.checked = true;
              return integration;
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
