'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', 'Session', 'Integration', 'integrationTableConfig', 'loEvents',
    function($scope, Session, Integration, integrationTableConfig, loEvents) {

      $scope.fetchIntegrations = function() {
        return Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.selectedIntegration = new Integration({
          tenantId: Session.tenant.tenantId,
          properties: {
            webRtc: true
          }
        });
      });

      $scope.submit = function() {
        return $scope.selectedIntegration.save();
      };

      $scope.tableConfig = integrationTableConfig;
    }
  ]);
