'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion', 'BulkAction',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowVersion, BulkAction) {
      $scope.getVersions = function(){
        if (angular.isUndefined($scope.selectedFlow)){
          return [];
        }
        
        return FlowVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.selectedFlow.id
        }, 'FlowVersion' + $scope.selectedFlow.id);
      };

      $scope.fetchFlows = function () {
        return Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.create = function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      };
      
      Flow.prototype.postCreate = function () {
        var flow = this;
        var initialVersion = new FlowVersion({
          flowId: flow.id,
          flow: '[]',
          tenantId: Session.tenant.tenantId,
          name: 'v1'
        });

        return initialVersion.$save().then(function(versionResult) {
          flow.activeVersion = versionResult.version;
          return flow.save();
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.additional = {
        flowTypes: flowTypes,
        getVersions: $scope.getVersions
      };
      
      $scope.tableConfig = flowTableConfig;
      $scope.bulkActions = {
        setFlowStatus: new BulkAction()
      };
    }
  ]);
