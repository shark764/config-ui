'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', [
    '$scope', 'Session', 'DispatchMapping', 'Flow', 'Integration', 'dispatchMappingTableConfig', 'dispatchMappingInteractionFields', 'dispatchMappingChannelTypes', 'dispatchMappingDirections', 'loEvents',
    function($scope, Session, DispatchMapping, Flow, Integration, dispatchMappingTableConfig, dispatchMappingInteractionFields, dispatchMappingChannelTypes, dispatchMappingDirections, loEvents) {
      var vm = this;
      
      $scope.create = function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId,
          channelType: 'voice',
          active: true
        });
      };

      vm.loadDispatchMappings = function() {
        $scope.dispatchMappings = DispatchMapping.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.loadIntegrations = function() {
        $scope.integrations = Integration.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.loadFlows = function() {
        $scope.flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.isTelInput = function() {
        if(!$scope.selectedDispatchMapping) {
          return;
        }
        
        return $scope.selectedDispatchMapping.interactionField === 'customer' ||
          $scope.selectedDispatchMapping.interactionField === 'contact-point';
      };
      
      $scope.submit = function() {
        return $scope.selectedDispatchMapping.save();
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });
      
      vm.loadIntegrations();
      vm.loadFlows();
      vm.loadDispatchMappings();
      
      $scope.tableConfig = dispatchMappingTableConfig;

      $scope.dispatchMappingInteractionFields = dispatchMappingInteractionFields;
      $scope.dispatchMappingChannelTypes = dispatchMappingChannelTypes;
      $scope.dispatchMappingDirections = dispatchMappingDirections;
    }
  ]);
