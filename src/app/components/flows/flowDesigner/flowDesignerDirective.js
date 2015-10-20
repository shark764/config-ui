(function() {
'use strict';
function flowDesigner() {
    return {
      scope: {
        flow: '=flow',
        flowData: '=flowData',
        notations: '=notations',
        readOnly: '=readOnly'
      },
      restrict: 'E',
      templateUrl: 'app/components/flows/flowDesigner/flowDesignerDirective.html',
      replace: true,
      link: function() {},
      controller: ['$scope', '$element', '$attrs', '$window', '$document', '$compile', '$timeout', 'FlowInitService', 'SubflowCommunicationService', 'FlowDraft', 'FlowVersion', 'Session', 'Alert', '$state', 'FlowLibrary', 'FlowValidationService', function($scope, $element, $attrs, $window, $document, $compile, $timeout, FlowInitService, SubflowCommunicationService, FlowDraft, FlowVersion, Session, Alert, $state, FlowLibrary, FlowValidationService) {

        $timeout(function() {

          FlowLibrary.loadData($scope.notations);

          var graphOptions = {
            width: 2000,
            height: 2000,
            gridSize: 12,
            perpendicularLinks: true,
            embeddingMode: true,
            frontParentOnly: false,
            defaultLink: new joint.shapes.liveOps.link(),
            scrollerPadding: 0,
            autoResizePaper: true,
            selectorFilterArray: [],
            stencilContainerId: '#stencil-container',
            paperContainerId: '#paper-container',
            inspectorContainerId: '#inspector-container',
            readOnly: $scope.readOnly
          };

          $scope.graph = FlowInitService.initializeGraph(graphOptions);

          $scope.graph.interfaces.paper.on({
            'cell:pointerdblclick': function(cellView) {
              if (cellView.model.attributes.name !== 'subflow') { return; }
              $scope.redirectToSubflowEditor(cellView);
            }
          });

          $scope.manuallyOpenPropertiesPanel = $scope.graph.utils.showPropertiesPanel;

          $scope.redirectToSubflowEditor = function(cellView) {
            SubflowCommunicationService.currentFlowContext = $scope.graph.toJSON();
            SubflowCommunicationService.currentVersionContext = $scope.flowVersion;
            SubflowCommunicationService.currentFlowNotationName = cellView.model.attributes.params.name || 'N/A';
            $state.go('content.flows.subflowEditor', {
              subflowNotationId: cellView.model.id
            });
          };

          $scope.$watch('flowData.name', function(newValue, oldValue){
            if(newValue !== oldValue) {$scope.$broadcast('update:draft');}
          });

          $scope.graph.on('change', function(){
            $scope.$broadcast('update:draft');
          });

          $scope.graph.on('add', function(){
            $scope.$broadcast('update:draft');
          });

          $scope.graph.on('remove', function(){
            $scope.$broadcast('update:draft');
          });

          var update = function(){
            if($scope.readOnly){
              return;
            }

            var request = $scope.flowData.$update({
              flow: JSON.stringify(FlowLibrary.convertToAlienese($scope.graph.toJSON())),
              name: $scope.flowData.name
            });

            request.then(function() {
              FlowValidationService.validate($scope.flowData, $scope.graph);
            });
          };

          var lazyUpdate = _.debounce(update, 1000);

          $scope.$on('update:draft', lazyUpdate);

          $scope.publishNewFlowDraft = function() {

            var graph = $scope.graph;
            if (graph.toJSON().cells.length === 0) { return; }
            if(!FlowValidationService.validate($scope.flowData, $scope.graph)) {return;}

            var newScope = $scope.$new();

            newScope.modalBody = 'app/components/flows/flowDesigner/newDraftModalTemplate.html';
            newScope.title = 'New Draft';
            newScope.draft = {
              name: 'Draft - ' + $scope.flowData.name,
              description: ''
            };

            newScope.okCallback = function(draft) {
              var alienese = FlowLibrary.convertToAlienese(graph.toJSON()),
                  _draft = new FlowDraft({
                    flow: JSON.stringify(alienese),
                    description: draft.description,
                    name: draft.name,
                    tenantId: Session.tenant.tenantId,
                    flowId: $scope.flowData.flowId
                  });

              _draft.save().then(function(d){
                $state.go('content.flows.editor', {
                  flowId: d.flowId,
                  draftId: d.id
                });
              });
              $document.find('modal').remove();
            };

            newScope.cancelCallback = function() {
              $document.find('modal').remove();
            };

            var element = $compile('<modal></modal>')(newScope);
            $document.find('html > body').append(element);
          };

          $scope.publishNewFlowVersion = function() {
            var graph = $scope.graph;
            if (graph.toJSON().cells.length === 0) { return; }

            FlowValidationService.validate($scope.flowData, $scope.graph).then(function (results) {
                if(results === true) {
                  var newScope = $scope.$new();

                  newScope.modalBody = 'app/components/flows/flowDesigner/publishModalTemplate.html';
                  newScope.title = 'Publish';
                  newScope.flow = {
                    name: $scope.flow.name,
                    active: true
                  };
                  newScope.version = {
                    name: '',
                    description: ''
                  };

                  newScope.okCallback = function(flow, version){
                    var alienese = FlowLibrary.convertToAlienese(graph.toJSON()),
                        _version = new FlowVersion({
                          flow: JSON.stringify(alienese),
                          description: version.description,
                          name: version.name,
                          tenantId: Session.tenant.tenantId,
                          flowId: $scope.flowData.flowId
                        });

                    _version.save(function(v){
                      $document.find('modal').remove();
                      Alert.success('New flow version successfully created.');
                      $scope.flowData.$delete().then(function(){
                        $scope.flow.$update({
                          name: flow.name,
                          activeVersion: (flow.active) ? v.version : flow.activeVersion
                        }).then(function(){
                          $state.go('content.flows.flowManagement', {}, {reload: true});
                        });
                      });

                    }, function(error) {
                      if (error.data.error.attribute === null) {
                        Alert.error('API rejected this flow -- likely invalid Alienese.', JSON.stringify(error, null, 2));
                      } else if (error.data.error.attribute.flow.message === 'Error parsing') {
                        $document.find('modal').remove();
                        Alert.error('API rejected this flow -- please verify your conditional statements are correct.');
                      } else {
                        Alert.error('API rejected this flow -- some other reason...', JSON.stringify(error, null, 2));
                      }
                    });
                  };
                  newScope.cancelCallback = function(){
                    $document.find('modal').remove();
                  };

                  var element = $compile('<modal></modal>')(newScope);
                  $document.find('html > body').append(element);
                }
            });
          };

          if (SubflowCommunicationService.currentFlowContext !== '') {
            $scope.graph.fromJSON(SubflowCommunicationService.currentFlowContext);
            SubflowCommunicationService.currentFlowContext = '';
          } else {
            if($scope.readOnly){
              var graphJSON = JSON.parse($scope.flowData.flow);
              var jjs = FlowLibrary.convertToJoint(graphJSON);
              $scope.graph.fromJSON(jjs);
            }
            else{
              var graphJSON = JSON.parse($scope.flowData.flow);
              FlowValidationService.checkEntities(graphJSON);
              var jjs = FlowLibrary.convertToJoint(graphJSON);
              $scope.graph.fromJSON(jjs);
              FlowValidationService.validate($scope.flowData, $scope.graph);
            }
          }
          $window.spitOutAlienese = function() {
            return FlowLibrary.convertToAlienese($scope.graph.toJSON());
          };

          $window.spitOutJoint = function() {
            return $scope.graph.toJSON();
          };

          $window.loadFlow = function(alienese){
            $scope.graph.fromJSON(FlowLibrary.convertToJoint(alienese));
          };

          $window.validate = function() {
            return FlowLibrary.validate($scope.graph.toJSON());
          };

          $window.search = function(target) {
            return FlowLibrary.search($scope.graph.toJSON(), target);
          };
        }, 1000);
      }]
    };
  }

angular.module('liveopsConfigPanel').directive('flowDesigner', flowDesigner);
})();
