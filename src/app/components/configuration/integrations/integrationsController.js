'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', '$state', 'Session', 'Integration', 'integrationTableConfig', 'loEvents',
    function($scope, $state, Session, Integration, integrationTableConfig, loEvents) {
      
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

      $scope.tableConfig = integrationTableConfig;
      
      $scope.submit = function(){
        return $scope.selectedIntegration.save();
      };
    }
  ]);
