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

      $scope.versionOrDraftCopyModal = function (flowData, dataToCopy) {
        flowSvc.cloneFlow(flowData, dataToCopy);
      };

      $scope.create = function(dataToCopy) {
        var sourceFlow;
        var versionOrDraftData;
        var newFlowData;
        var modalTitle;

        // if we have an object passed to this function, then we are going to copy
        // that data
        if (dataToCopy) {
          $scope.isCopy = true;

          if (dataToCopy.hasOwnProperty('selectedFlowData')) {
            sourceFlow = dataToCopy.selectedFlowData;
          }

          if (dataToCopy.hasOwnProperty('selectedFlowDataToCopy')) {
            versionOrDraftData = dataToCopy.selectedFlowDataToCopy;
          }
        }

        // if we're copying a flow, use the appriate title
        if ($scope.isCopy) {
          // extract only the props we need to create a copy, and
          newFlowData = extractPropsToCopy(sourceFlow, flowCopyPropList);
          // update modal default name text to reflect that this is a copy
          newFlowData.name = $translate.instant('flow.copyOfSelectedFlow') + sourceFlow.name;
          newFlowData.description = sourceFlow.description || '';
          if (versionOrDraftData) {
            modalTitle = $translate.instant('flow.copyAFlow');
          } else {
            modalTitle = $translate.instant('flow.copySelectedFlow');
          }
        } else {
          newFlowData = {
            name: $translate.instant('flow.untitledFlow')
          };
          modalTitle = $translate.instant('flow.newFlow');
        }

        var newScope = $scope.$new();
        newScope.modalBody = 'app/components/flows/flowManagement/newFlow.modal.html';
        newScope.title = modalTitle;
        newScope.flow = newFlowData;

        newScope.cancelCallback = function() {
          $document.find('modal').remove();
        };

        newScope.okCallback = function(newFlow) {
          var newFlowCopy = new Flow({
            tenantId: Session.tenant.tenantId,
            active: false,
            name: newFlow.name,
            type: newFlow.type,
            description: newFlow.description || ''
          });

          return newFlowCopy.save(function(flow){
            $document.find('modal').remove();

            // if it's a copy, then we need to make the initial draft a duplicate of
            // the active version of the flow we're copying
            if (versionOrDraftData) {
              saveDraft(flow, versionOrDraftData);
            } else if ($scope.isCopy) {
              if (_.has(sourceFlow, 'activeFlow.flowId') && sourceFlow.activeFlow.flowId) {
                var activeFlowFromSource = FlowVersion.cachedGet({
                  tenantId: Session.tenant.tenantId,
                  flowId: sourceFlow.activeFlow.flowId,
                  version: sourceFlow.activeFlow.version
                }, 'FlowVersion' + flow.id);

                activeFlowFromSource.$promise.then(function (activeFlowResponse) {
                  saveDraft(flow, activeFlowResponse.flow);
                });
              }
            } else {
              // if we're creating a brand new flow no need to pass any flow
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
      // at the top of the screen or the "copy" links in the version and drafts table
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
