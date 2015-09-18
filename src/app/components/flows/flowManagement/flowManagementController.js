'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion', 'BulkAction',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowVersion, BulkAction) {
      $scope.getVersions = function(){
        if (! $scope.selectedFlow || $scope.selectedFlow.isNew()){
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
      
      Flow.prototype.postCreate = function(){
        var flow = this;
        var initialVersion = new FlowVersion({
          flowId: flow.id,
          flow: '[]',
          tenantId: Session.tenant.tenantId,
          name: 'v1'
        });

        initialVersion.$save().then(function(versionResult) {
          flow.activeVersion = versionResult.version;
          flow.save();
        });
        
        return flow;
      };
      
      $scope.submit = function() {
        return $scope.selectedFlow.save();
      };

      $scope.$on('table:on:click:create', function () {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      });

      $scope.flowTypes = flowTypes;
      $scope.tableConfig = flowTableConfig;
      $scope.bulkActions = {
        setFlowStatus: new BulkAction()
      };
    }
  ]);
