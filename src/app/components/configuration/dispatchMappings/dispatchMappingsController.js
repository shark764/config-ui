'use strict';

angular.module('liveopsConfigPanel')
  .controller('DispatchMappingsController', ['$scope', 'Session', 'DispatchMapping', 'Flow', 'dispatchMappingTableConfig',
    function($scope, Session, DispatchMapping, Flow, dispatchMappingTableConfig) {
      $scope.fetch = function() {
        $scope.dispatchMappings = DispatchMapping.query({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);
      
      $scope.flows = Flow.query({
        tenantId: Session.tenant.tenantId
      });

      $scope.additional = {
        flows: $scope.flows
      };

      $scope.$on('on:click:create', function() {
        $scope.selectedDispatchMapping = new DispatchMapping({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.tableConfig = dispatchMappingTableConfig;
      $scope.fetch();
    }
  ]);
