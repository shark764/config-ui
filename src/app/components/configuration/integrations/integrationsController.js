'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', 'Session', 'Integration', 'Listener', 'integrationTableConfig', 'loEvents', '$q', 'twilioRegions',
    function($scope, Session, Integration, Listener, integrationTableConfig, loEvents, $q, twilioRegions) {

      $scope.twilioRegions = twilioRegions;

      $scope.fetchIntegrations = function() {
        return Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetchListeners = function(invalidate) {
        return Listener.cachedQuery({
          tenantId: Session.tenant.tenantId,
          integrationId: $scope.selectedIntegration.id
        }, 'Listener' + $scope.selectedIntegration.id, invalidate);
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

      $scope.updateActive = function(){
        var integrationCopy = new Integration({
          id: $scope.selectedIntegration.id,
          tenantId: $scope.selectedIntegration.tenantId,
          active: ! $scope.selectedIntegration.active
        });

        return integrationCopy.save().then(function(result){
          $scope.selectedIntegration.$original.active = result.active;
          $scope.fetchListeners(true);
        }, function(errorResponse){
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.tableConfig = integrationTableConfig;
    }
  ]);
