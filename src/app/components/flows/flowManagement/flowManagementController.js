'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowDraft', 'FlowVersion', 'BulkAction',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowDraft, FlowVersion, BulkAction) {
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

      $scope.create = function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId,
          active: true,
          name: 'Untitled Flow',
          type: 'customer'
        }).save(function(flow){
          var initialDraft = new FlowDraft({
            flowId: flow.id,
            flow: '[]',
            tenantId: Session.tenant.tenantId,
            name: 'Initial Draft'
          });

          var promise = initialDraft.save();
          return promise.then(function(draft){
            $state.go('content.flows.editor', {
              flowId: flow.id,
              draftId: draft.id
            });
          });
        });
      };

      $scope.saveFlow = function(){
        return $scope.selectedFlow.save().then(function(flow){
          return flow;
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.flowTypes = flowTypes;
      $scope.tableConfig = flowTableConfig;
      $scope.bulkActions = {
        setFlowStatus: new BulkAction()
      };
    }
  ]);
