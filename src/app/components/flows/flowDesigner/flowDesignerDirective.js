(function() {
'use strict';
function flowDesigner() {
    return {
      scope: {
        flowVersion: '=flowVersion'
      },
      restrict: 'E',
      templateUrl: 'app/components/flows/flowDesigner/flowDesignerDirective.html',
      replace: true,
      link: function() {},
      controller: ['$scope', '$element', '$attrs', '$window', '$timeout', 'FlowInitService', 'FlowConversionService', 'SubflowCommunicationService', 'FlowNotationService', 'FlowVersion', 'Session', 'Alert', '$state', function($scope, $element, $attrs, $window, $timeout, FlowInitService, FlowConversionService, SubflowCommunicationService, FlowNotationService, FlowVersion, Session, Alert, $state) {

        $timeout(function() {
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
          var graph = FlowInitService.initializeGraph(graphOptions);

          graph.interfaces.paper.on({
            'cell:pointerdblclick': function(cellView) {
              if (cellView.model.attributes.name !== 'subflow') { return; }
              $scope.redirectToSubflowEditor(cellView);
            }
          });

          $scope.manuallyOpenPropertiesPanel = graph.utils.showPropertiesPanel;

          $scope.redirectToSubflowEditor = function(cellView) {
            SubflowCommunicationService.currentFlowContext = graph.toJSON();
            SubflowCommunicationService.currentVersionContext = $scope.flowVersion;
            SubflowCommunicationService.currentFlowNotationName = cellView.model.attributes.params.name || 'N/A';
            $state.go('content.flows.subflowEditor', {
              subflowNotationId: cellView.model.id
            });
          };

          $scope.publishNewFlowVersion = function() {
            if (graph.toJSON().cells.length === 0) { return; }
            var alienese = JSON.stringify(FlowConversionService.convertToAlienese(graph.toJSON()));
            $scope.version = new FlowVersion({
              flow: alienese,
              description: $scope.flowVersion.description || 'This needs to be fixed',
              name: $scope.flowVersion.name
            });

            $scope.version.save({
              tenantId: Session.tenant.tenantId,
              flowId: $scope.flowVersion.flowId
            }, function() {
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
            graph.fromJSON(SubflowCommunicationService.currentFlowContext);
            SubflowCommunicationService.currentFlowContext = '';
          } else {
            graph.fromJSON(FlowConversionService.convertToJoint(JSON.parse($scope.flowVersion.flow)));
          }
          $window.spitOutAlienese = function() {
            return FlowConversionService.convertToAlienese(graph.toJSON());
          };
        }, 1000);
      }]
    };
  }

angular.module('liveopsConfigPanel').directive('flowDesigner', flowDesigner);
})();
