(function() {
'use strict';
function flowDesigner() {
    return {
      scope: {
        flowVersion: '=flowVersion',
        notations: '=notations'
      },
      restrict: 'E',
      templateUrl: 'app/components/flows/flowDesigner/flowDesignerDirective.html',
      replace: true,
      link: function() {},
      controller: ['$scope', '$element', '$attrs', '$window', '$timeout', 'FlowInitService', 'SubflowCommunicationService', 'FlowVersion', 'Session', 'Alert', '$state', 'flowLibrary', function($scope, $element, $attrs, $window, $timeout, FlowInitService, SubflowCommunicationService, FlowVersion, Session, Alert, $state, flowLibrary) {

        $timeout(function() {

          var FlowConverter = new flowLibrary($scope.notations);

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
            inspectorContainerId: '#inspector-container'
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
              V(view.el).removeClass('error');
            })
          }

          function addErrors(errors) {
            var graph = $scope.graph;
            _.each(errors, function(e) {
              var cell = graph.getCell(e.step);
              var view = cell.findView(graph.interfaces.paper);
              V(view.el).addClass('error');
            })
          }

          $scope.publishNewFlowVersion = function() {

            var graph = $scope.graph;

            if (graph.toJSON().cells.length === 0) { return; }

            clearErrors();

            var errors = FlowConverter.validate(graph.toJSON());

            if (errors.length > 0) {
              addErrors(errors);
              return;
            }

            var alienese = FlowConverter.convertToAlienese(graph.toJSON());

            $scope.version = new FlowVersion({
              flow: JSON.stringify(alienese),
              description: $scope.flowVersion.description || 'This needs to be fixed',
              name: $scope.flowVersion.name,
              tenantId: Session.tenant.tenantId,
              flowId: $scope.flowVersion.flowId
            });

            $scope.version.save(function() {
              Alert.success('New flow version successfully created.');
              $scope.flowVersion.v = parseInt($scope.flowVersion.v) + 1;
            }, function(error) {
              if (error.data.error.attribute === null) {
                Alert.error('API rejected this flow -- likely invalid Alienese.', JSON.stringify(error, null, 2));
              } else {
                Alert.error('API rejected this flow -- some other reason...', JSON.stringify(error, null, 2));
              }
            });
          };

          if (SubflowCommunicationService.currentFlowContext !== '') {
            $scope.graph.fromJSON(SubflowCommunicationService.currentFlowContext);
            SubflowCommunicationService.currentFlowContext = '';
          } else {
            $scope.graph.fromJSON(FlowConverter.convertToJoint(JSON.parse($scope.flowVersion.flow)));
          }
          $window.spitOutAlienese = function() {
            return FlowConverter.convertToAlienese($scope.graph.toJSON());
          };

          $window.spitOutJoint = function() {
            return $scope.graph.toJSON();
          };

          $window.loadFlow = function(alienese){
            $scope.graph.fromJSON(FlowConverter.convertToJoint(alienese));
          };

          $window.validate = function() {
            return FlowConverter.validate($scope.graph.toJSON());
          }

          $window.search = function(target) {
            return FlowConverter.search($scope.graph.toJSON(), target);
          };
        }, 1000);
      }]
    };
  }

angular.module('liveopsConfigPanel').directive('flowDesigner', flowDesigner);
})();
