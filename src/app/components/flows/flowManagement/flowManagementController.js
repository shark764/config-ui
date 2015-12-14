'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', '$document', '$compile', '$location', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowDraft', 'FlowVersion', 'BulkAction', 'loEvents', '_',
    function ($scope, $state, $document, $compile, $location, Session, Flow, flowTableConfig, flowTypes, FlowDraft, FlowVersion, BulkAction, loEvents, _) {

      $scope.getVersions = function(){
        if (! $scope.selectedFlow || $scope.selectedFlow.isNew()){
          return [];
        }

        var versions = FlowVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.selectedFlow.id
        }, 'FlowVersion' + $scope.selectedFlow.id);

        _.each(versions, function(version, index){
          version.fakeVersion = 'v' + (versions.length - index);
        });

        return versions;
      };

      $scope.fetchFlows = function () {
        return Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.newDraftModal = function(version){
        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/flows/flowManagement/newDraft.modal.html';
        newScope.title = 'New Draft';
        newScope.draft = {
          name: version.name + ' - draft'
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(draft) {
          var newFlow = new FlowDraft({
            flowId: version.flowId,
            flow: version.flow,
            tenantId: Session.tenant.tenantId,
            name: draft.name
          })
          
          return newFlow.save().then(function(draft){
            $document.find('modal').remove();
            $state.go('content.flows.editor', {
              flowId: draft.flowId,
              draftId: draft.id
            });
          });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);
      };

      $scope.create = function() {
        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/flows/flowManagement/newFlow.modal.html';
        newScope.title = 'New Flow';
        newScope.flow = {
          name: 'Untitled Flow',
          flowTypes: flowTypes
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(newFlow) {
          var newFlow = new Flow({
            tenantId: Session.tenant.tenantId,
            active: true,
            name: newFlow.name,
            type: newFlow.type
          });
          
          return newFlow.save(function(flow){
            $document.find('modal').remove();
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
