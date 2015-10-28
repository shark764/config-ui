'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', [
    '$scope', 'Session', 'DispatchMapping', 'Flow', 'Integration', 'dispatchMappingTableConfig', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', 'dispatchMappingDirections', 'BulkAction',
    function($scope, Session, DispatchMapping, Flow, Integration, dispatchMappingTableConfig, dispatchMappingInteractionFields, dispatchMappingChannelTypes, dispatchMappingDirections, BulkAction) {
      $scope.create = function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId,
          channelType: 'voice',
          active: true
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
      
      $scope.submit = function() {
        return $scope.selectedDispatchMapping.save();
      };

      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });

      $scope.tableConfig = dispatchMappingTableConfig;
      
      $scope.dispatchMappingInteractionFields = dispatchMappingInteractionFields;
      $scope.dispatchMappingChannelTypes = dispatchMappingChannelTypes;
      $scope.dispatchMappingDirections = dispatchMappingDirections;
      
      $scope.bulkActions = {
        setDispatchMappingStatus: new BulkAction()
      };
    }
  ]);
