'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', [
    '$scope', 'Session', 'DispatchMapping', 'Flow', 'Integration', 'dispatchMappingTableConfig', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', 'dispatchMappingDirections',
    function($scope, Session, DispatchMapping, Flow, Integration, dispatchMappingTableConfig, dispatchMappingInteractionFields, dispatchMappingChannelTypes, dispatchMappingDirections) {
      $scope.create = function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId,
          channelType: 'voice'
        });
      };

      $scope.fetch = function() {
        if (!Session.tenant || !Session.tenant.tenantId) {
          return;
        }

        $scope.dispatchMappings = DispatchMapping.query({
          tenantId: Session.tenant.tenantId
        }, function(dispatchMappings) {
          if (!dispatchMappings.length) {
            $scope.create();
          }
        });

        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        });
        
        $scope.integrations = Integration.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant', $scope.fetch, true);

      $scope.$on('on:click:create', function() {
        $scope.create();
      });

      $scope.tableConfig = dispatchMappingTableConfig;
      $scope.fetch();

      $scope.additional = {
        flows: $scope.flows,
        integrations: $scope.integrations,
        dispatchMappingInteractionFields: dispatchMappingInteractionFields,
        dispatchMappingChannelTypes: dispatchMappingChannelTypes,
        dispatchMappingDirections: dispatchMappingDirections
      };
    }
  ]);
