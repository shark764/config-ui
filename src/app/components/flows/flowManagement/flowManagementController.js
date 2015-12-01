'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', '$document', '$compile', '$location', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowDraft', 'FlowVersion', 'BulkAction', 'loEvents',
    function ($scope, $state, $document, $compile, $location, Session, Flow, flowTableConfig, flowTypes, FlowDraft, FlowVersion, BulkAction, loEvents) {

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
        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/flows/flowManagement/newFlowModal.html';
        newScope.title = 'New Flow';
        newScope.flow = {
          name: 'Untitled Flow',
          flowTypes: flowTypes
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(newFlow) {
          $document.find('modal').remove();
          new Flow({
            tenantId: Session.tenant.tenantId,
            active: true,
            name: newFlow.name,
            type: newFlow.type
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

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);

      };

      $scope.saveFlow = function(){
        return $scope.selectedFlow.save().then(function(flow){
          return flow;
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.flowTypes = flowTypes;
      $scope.tableConfig = flowTableConfig;
      $scope.bulkActions = {
        setFlowStatus: new BulkAction()
      };

      $scope.submit = function(){
        return $scope.selectedFlow.save();
      };
    }
  ]);
