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

      $scope.fetch = function() {

        if (!Session.tenant || !Session.tenant.tenantId) {
          return;
        }

        $scope.dispatchMappings = DispatchMapping.query({
          tenantId: Session.tenant.tenantId
        });

        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        });

        $scope.integrations = Integration.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant', $scope.fetch, true);

      $scope.$on('table:on:click:create', function() {
        $scope.showBulkActions = false;
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
