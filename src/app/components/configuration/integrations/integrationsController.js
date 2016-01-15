'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', 'Session', 'Integration', 'integrationTableConfig', 'loEvents', '$q',
    function($scope, Session, Integration, integrationTableConfig, loEvents, $q) {

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
      
      $scope.updateActive = function(){
        var integrationCopy = new Integration({
          id: $scope.selectedIntegration.id,
          tenantId: $scope.selectedIntegration.tenantId,
          active: ! $scope.selectedIntegration.active
        });
        
        return integrationCopy.save().then(function(result){
          $scope.selectedIntegration.$original.active = result.active;
        }, function(errorResponse){
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.tableConfig = integrationTableConfig;
    }
  ]);
