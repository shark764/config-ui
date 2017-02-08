'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$rootScope', '$scope', '$state', '$document', '$compile', 'Session', '$translate', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowDraft', 'FlowVersion', 'loEvents', '$q','Alert',
    function ($rootScope, $scope, $state, $document, $compile, Session, $translate, Flow, flowTableConfig, flowTypes, FlowDraft, FlowVersion, loEvents, $q, Alert) {
      var flowSvc = new Flow();
      flowSvc.getScope($scope);

      var flowCopyPropList = [
        'activeFlow',
        'channelType',
        'createdBy',
        'description',
        'tenantId',
        'type'
      ];

      // we use this to strip out any unnecessary properties from
      // the flow we are copying
      function extractPropsToCopy (itemData, propList) {
        var copyOfItemData = {};

        _.forEach(propList, function (val) {
          if (itemData[val]) {
            copyOfItemData[val] = itemData[val];
          }
        });

        return copyOfItemData;
      }

      $scope.getVersions = function(){
        if (! $scope.selectedFlow || $scope.selectedFlow.isNew()){
          return [];
        }

        var versions = FlowVersion.cachedQuery({
          tenantId: Session.tenant.tenantId,
          flowId: $scope.selectedFlow.id
        }, 'FlowVersion' + $scope.selectedFlow.id);

        angular.forEach(versions, function(version, index){
          version.fakeVersion = $translate.instant('flow.flowVersionNamePrefix') + (versions.length - index);
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
        newScope.title = $translate.instant('flow.newDraft');
        newScope.draft = {
          name: version.name + $translate.instant('flow.flowDraftAffix')
        };

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(draft) {
          var newFlow = new FlowDraft({
            flowId: version.flowId,
            flow: version.flow,
            tenantId: Session.tenant.tenantId,
            name: draft.name,
            metadata: version.metadata
          });

          return newFlow.save().then(function(draft){
            $document.find('modal').remove();
            $state.go('content.flows.editor', {
              flowId: draft.flowId,
              draftId: draft.id
            });
          }).catch(function(err){
            Alert.error(err.data.error.attribute.name.capitalize());
          });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);
      };

      function saveDraft (responseFromFlowSave, dataFromActiveFlow) {
        var initialDraft = new FlowDraft({
          flowId: responseFromFlowSave.id,
          flow: dataFromActiveFlow,
          tenantId: Session.tenant.tenantId,
          name: $translate.instant('flow.initialDraft')
        });

        var promise = initialDraft.save();
        return promise.then(function(draft){
          $state.go('content.flows.editor', {
            flowId: responseFromFlowSave.id,
            draftId: draft.id
          });
        });
      }

      $scope.create = function(dataToCopy) {
        // if we have an object passed to this function, then we are going to copy
        // that data
        var isCopy = false;
        if (dataToCopy && dataToCopy.hasOwnProperty('id')) {
          isCopy = true;
        }

        // populate the modal that pops up to create the flow
        var newFlowTitle = $translate.instant('flow.newFlow');
        var newFlowData = {
          name: $translate.instant('flow.untitledFlow')
        };

        // if we're copying a flow, using different text for the modal, and
        // also extract only the props we need to create a copy
        if (isCopy) {
          newFlowTitle = $translate.instant('flow.copySelectedFlow');
          newFlowData = extractPropsToCopy(dataToCopy, flowCopyPropList);
          newFlowData.name = $translate.instant('flow.copyOfSelectedFlow') + dataToCopy.name;
        }

        newFlowData.flowTypes = flowTypes;

        var newScope = $scope.$new();

        newScope.modalBody = 'app/components/flows/flowManagement/newFlow.modal.html';
        newScope.title = newFlowTitle;
        newScope.flow = newFlowData;

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

          // we needed flowTypes to create the modal for copying,
          // but we can't save with it, so we're deleting it
          if (isCopy) {
            delete newFlowData.flowTypes;
          }

          return newFlowCopy.save(function(flow){
            $document.find('modal').remove();

            // if it's a copy, then we need to make the initial draft a duplicate of
            // the active version of the flow we're copying
            if (isCopy && _.has(dataToCopy, 'activeFlow.flowId') && dataToCopy.activeFlow.flowId) {
              var activeFlowFromSource = FlowVersion.cachedGet({
                tenantId: Session.tenant.tenantId,
                flowId: dataToCopy.activeFlow.flowId,
                version: dataToCopy.activeFlow.version
              }, 'FlowVersion' + flow.id);

              activeFlowFromSource.$promise.then(function (activeFlowResponse) {
                saveDraft(flow, activeFlowResponse.flow);
              });
            } else {
              // if we're creating a brand new flow, no need to pass any flow
              // designer data to the new flow we just created
              saveDraft(flow, '[]');
            }
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

      $scope.updateActive = function(){
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

      // this handles creation of flows from the "duplicate flow" button
      // at the top of the screen
      $scope.$on('flowSvc:cloneFlow', function (event, data) {
        $scope.create(data);
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
