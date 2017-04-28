'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$rootScope', '$scope', '$state', '$document', '$compile', '$location',  'Session', '$translate', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowDraft', 'FlowVersion', 'loEvents', '$q','Alert',
    function ($rootScope, $scope, $state, $document, $compile, $location, Session, $translate, Flow, flowTableConfig, flowTypes, FlowDraft, FlowVersion, loEvents, $q, Alert) {
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

      // if we are coming back to the flow management page directly
      // from the flow designer, make sure to return the user
      // to the last selected flow
      if (flowSvc.getSavedFlow()) {
        $location.search({
          id: flowSvc.getSavedFlow().id
        });

        //Broadcast the selected event with the newly selected item, and the previously selected item
        $rootScope.$broadcast(loEvents.tableControls.itemSelected, flowSvc.getSavedFlow(), $scope.selected);


        $scope.selected = flowSvc.getSavedFlow();
      }

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
            flowSvc.setSavedFlow(version.flow);

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
        var flowDraftProps = {
          flowId: responseFromFlowSave.id,
          tenantId: Session.tenant.tenantId,
          name: $translate.instant('flow.initialDraft')
        };

        // here is where we insert possible data from a
        // copied draft or version
        if (dataFromActiveFlow) {
          if (dataFromActiveFlow.flow) {
            flowDraftProps.flow = dataFromActiveFlow.flow;
          }

          if (dataFromActiveFlow.metadata) {
            flowDraftProps.metadata = dataFromActiveFlow.metadata;
          }
        // regardless of whether we're saving a copy or a new version, we always have
        // to specify a flow value, so setting a fallback val of '[]' here
        } else {
          flowDraftProps.flow = '[]';
        }

        var initialDraft = new FlowDraft(flowDraftProps);

        var promise = initialDraft.save();
        return promise.then(function(draft){
          flowSvc.setSavedFlow(responseFromFlowSave);
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

          if (dataToCopy.hasOwnProperty('flow')) {
            versionOrDraftData = dataToCopy;
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

          return newFlowCopy.save().then(function(flow){
            flowSvc.setSavedFlow(flow);

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
                  saveDraft(flow, activeFlowResponse);
                });
              }
            } else {
              // if we're creating a brand new flow no need to pass any flow
              // designer data to the new flow we just created
              saveDraft(flow);
            }

          });
        };

        var element = $compile('<modal></modal>')(newScope);
        $document.find('html > body').append(element);
      };

      $scope.saveFlow = function(){
        return $scope.selectedFlow.save().then(function(flow){
          flowSvc.setSavedFlow(flow);

          return flow;
        });
      };

      $scope.updateActive = function(overRideSelectedFlow){
        var flowActiveStatus;

        if (overRideSelectedFlow) {
          flowActiveStatus = true;
        } else {
          flowActiveStatus = ! $scope.selectedFlow.active;
        }

        var flowCopy = new Flow({
          id: overRideSelectedFlow || $scope.selectedFlow.id,
          tenantId: $scope.selectedFlow.tenantId,
          active: flowActiveStatus
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
          $q.when(newValue).then(function (flowData) {
            if (newValue.active === false && newValue.activeVersion !== null) {
              $scope.updateActive(flowData.id);
              $scope.selectedFlow.active = true;
            }
          });

          $scope.getVersions();

          $scope.selectedFlow.reset(); //TODO: figure out why this is needed
        }
      });

      $scope.flowTypes = flowTypes;
      $scope.tableConfig = flowTableConfig;

      $scope.submit = function(){
        return $scope.selectedFlow.save().then(function(flowData){
          flowSvc.setSavedFlow(flowData);
        });
      };
    }
  ]);
