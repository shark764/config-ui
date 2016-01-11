'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', '$document', '$compile', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowDraft', 'FlowVersion', 'loEvents', '$q',
    function ($scope, $state, $document, $compile, Session, Flow, flowTableConfig, flowTypes, FlowDraft, FlowVersion, loEvents, $q) {

      $scope.getVersions = function(){
        if (! $scope.selectedFlow || $scope.selectedFlow.isNew()){
          return [];
        }

        var versions = FlowVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.selectedFlow.id
        }, 'FlowVersion' + $scope.selectedFlow.id);

        angular.forEach(versions, function(version, index){
          version.fakeVersion = 'v' + (versions.length - index);
        });

        return versions;
      };

      $scope.fetchFlows = function () {

        var flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        _.remove(flows, function (flow) {
          return flow.tenantId !== Session.tenant.tenantId;
        });

        return flows;
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
          });

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
          var newFlowCopy = new Flow({
            tenantId: Session.tenant.tenantId,
            active: true,
            name: newFlow.name,
            type: newFlow.type
          });

          return newFlowCopy.save(function(flow){
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
      
      $scope.updateActive = function(newVal){
        var flowCopy = new Flow({
          id: $scope.selectedFlow.id,
          tenantId: $scope.selectedFlow.tenantId,
          active: ! $scope.selectedFlow.active
        });
        
        return flowCopy.save().then(function(result){
          $scope.selectedFlow.$original.active = result.active;
        }, function(errorResponse){
          return $q.reject(errorResponse.data.error.attribute.active);
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.create();
      });

      $scope.$watch('selectedFlow', function(newValue){
        if (newValue){
          $scope.getVersions();
          $scope.selectedFlow.reset(); //TODO: figure out why this is needed
        }
      });

      $scope.flowTypes = flowTypes;
      $scope.tableConfig = flowTableConfig;

      $scope.submit = function(){
        return $scope.selectedFlow.save();
      };
    }
  ]);
