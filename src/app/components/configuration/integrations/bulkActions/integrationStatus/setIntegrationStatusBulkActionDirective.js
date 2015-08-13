'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetIntegrationStatus', ['Integration', 'Session',
    function (Integration, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/configuration/integrations/bulkActions/integrationStatus/setIntegrationStatusBulkAction.html',
        link: function ($scope) {
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
