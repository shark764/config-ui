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
      controller: ['$scope', '$element', '$attrs', '$window', '$document', '$compile', '$timeout', 'FlowInitService', 'SubflowCommunicationService', 'FlowDraft', 'FlowVersion', 'Session', 'Alert', '$state', 'FlowLibrary', function($scope, $element, $attrs, $window, $document, $compile, $timeout, FlowInitService, SubflowCommunicationService, FlowDraft, FlowVersion, Session, Alert, $state, FlowLibrary) {

        $timeout(function() {
          //This must be preloaded as it is used when connection is down
          function preloadNetworkModal() {
            var newScope = $scope.$new();

            newScope.modalBody = 'app/components/flows/flowDesigner/networkIssueModal.html';
            newScope.title = 'Network Connection';

            newScope.okCallback = function() {
              $document.find('modal').remove();
              update();
            };

            return $compile('<modal></modal>')(newScope);
          }

          $scope.networkModal = preloadNetworkModal();

          FlowLibrary.loadData($scope.notations);

          var graphOptions = {
            width: 2000,
            height: 2000,
            gridSize: 20,
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

          function clearErrors() {
            var graph = $scope.graph;
            _.each(graph.getElements(), function(element) {
              var view = element.findView(graph.interfaces.paper);
              new V(view.el).removeClass('error');
            });
          }

          function addErrors(errors) {
            var graph = $scope.graph;
            _.each(errors, function(e) {
              var cell = graph.getCell(e.step);
              var view = cell.findView(graph.interfaces.paper);
              new V(view.el).addClass('error');
            });
          }

          function validate(graph) {
            var errors;

            var apiValidation = $scope.flowData.validate();

            return apiValidation.then(function(results) {
              clearErrors();
              errors = FlowLibrary.validate(graph.toJSON());

              if(results !== true) {
                errors.push(results.data.error.attribute.flow);
              }

              if(errors.length > 0){
                addErrors(errors);
                return false;
              }
              else { return true; }
            });
          }

          $scope.$watch('flowData.name', function(newValue, oldValue){
            if(newValue !== oldValue) {$scope.$broadcast('update:draft');}
          });

          $scope.$watch('online', function(state) {
            if(state === false) {
              $document.find('html > body').append($scope.networkModal);
            }
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
              $scope.online = true;
              validate($scope.graph);
            }).catch(function (rejection) {
              if(rejection.status === -1) {
                $scope.online = false;
              } else {
                $scope.online = true;
              }
            });
          };

          var lazyUpdate = _.debounce(update, 1000);

          $scope.$on('update:draft', lazyUpdate);

          $scope.publishNewFlowDraft = function() {

            var graph = $scope.graph;
            if (graph.toJSON().cells.length === 0) { return; }
            clearErrors();
            if(!validate) {return;}

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

            validate($scope.graph).then(function (results) {
                if(results === true) {
                  var newScope = $scope.$new();

                  newScope.modalBody = 'app/components/flows/flowDesigner/publishModalTemplate.html';
                  newScope.title = 'Publish';
                  newScope.flow = {
                    name: $scope.flow.name
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
                        addErrors([error.data.error.attribute.flow]);
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
            var graphJSON = JSON.parse($scope.flowData.flow);
            var jjs = FlowLibrary.convertToJoint(graphJSON);
            $scope.graph.fromJSON(jjs);
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
