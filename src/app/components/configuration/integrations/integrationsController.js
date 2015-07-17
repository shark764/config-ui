'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', '$state', 'Session', 'Integration', 'integrationTableConfig', 'BulkAction',
    function($scope, $state, Session, Integration, integrationTableConfig, BulkAction) {
      
      $scope.fetch = function() {
        $scope.integrations = Integration.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.$on('table:on:click:create', function() {
        $scope.showBulkActions = false;
        
        $scope.selectedIntegration = new Integration({
          tenantId: Session.tenant.tenantId,
          properties: {
            webRtc: true
          }
        });
      });

      $scope.tableConfig = integrationTableConfig;
      $scope.fetch();
      
      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });
      
      $scope.bulkActions = {
        setIntegrationStatus: new BulkAction()
      };
    }
  ]);
