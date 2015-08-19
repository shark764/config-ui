'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', '$state', 'Session', 'Integration', 'integrationTableConfig', 'BulkAction',
    function($scope, $state, Session, Integration, integrationTableConfig, BulkAction) {
      
      $scope.fetchIntegrations = function() {
        return Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.selectedIntegration = new Integration({
          tenantId: Session.tenant.tenantId,
          properties: {
            webRtc: true
          }
        });
      });

      $scope.tableConfig = integrationTableConfig;
      
      $scope.bulkActions = {
        setIntegrationStatus: new BulkAction()
      };
    }
  ]);
