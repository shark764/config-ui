'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', [
    '$scope', 'Session', 'DispatchMapping', 'Flow', 'dispatchMappingTableConfig', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes',
    function($scope, Session, DispatchMapping, Flow, dispatchMappingTableConfig, dispatchMappingInteractionFields, dispatchMappingChannelTypes) {
      $scope.create = function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.fetch = function() {
        if (!Session.tenant || !Session.tenant.tenantId) {
          return;
        }

        $scope.dispatchMappings = DispatchMapping.query({
          tenantId: Session.tenant.tenantId
        }, function() {
          if (!$scope.dispatchMappings.length) {
            $scope.create();
          }
        });

        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.$on('on:click:create', function() {
        $scope.create();
      });

      $scope.tableConfig = dispatchMappingTableConfig;
      $scope.fetch();

      $scope.additional = {
        flows: $scope.flows,
        dispatchMappingInteractionFields: dispatchMappingInteractionFields,
        dispatchMappingChannelTypes: dispatchMappingChannelTypes
      };
    }
  ]);
