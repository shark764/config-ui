'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', [
    '$scope', 'Session', 'DispatchMapping', 'Flow', 'Integration', 'dispatchMappingTableConfig', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', 'dispatchMappingDirections', 'BulkAction',
    function($scope, Session, DispatchMapping, Flow, Integration, dispatchMappingTableConfig, dispatchMappingInteractionFields, dispatchMappingChannelTypes, dispatchMappingDirections, BulkAction) {
      $scope.create = function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId,
          channelType: 'voice'
        });
      };

      $scope.fetchDispatchMappings = function() {
        return DispatchMapping.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.fetchIntegrations = function() {
        return Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.fetchFlows = function() {
        return Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.showBulkActions = false;
        $scope.create();
      });

      $scope.tableConfig = dispatchMappingTableConfig;

      $scope.additional = {
        fetchFlows: $scope.fetchFlows,
        fetchIntegrations: $scope.fetchIntegrations,
        dispatchMappingInteractionFields: dispatchMappingInteractionFields,
        dispatchMappingChannelTypes: dispatchMappingChannelTypes,
        dispatchMappingDirections: dispatchMappingDirections
      };
      
      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });
      
      $scope.bulkActions = {
        setDispatchMappingStatus: new BulkAction()
      };
    }
  ]);
