(function() {
'use strict';
function flowDesigner() {
    return {
      scope: {
        flowVersion: '=flowVersion'
      },
      restrict: 'E',
      templateUrl: 'app/components/designer/designer/designerDirective.html',
      replace: true,
      link: function() {},
      controller: ['$scope', '$element', '$attrs', '$window', '$timeout', 'JointInitService', 'FlowConversionService', 'FlowNotationService', 'FlowVersion', 'Session', 'toastr', '$state', function($scope, $element, $attrs, $window, $timeout, JointInitService, FlowConversionService, FlowNotationService, FlowVersion, Session, toastr, $state) {

        $timeout(function() {
          var graphOptions = {
            width: 1280,
            height: 800,
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
          var graph = JointInitService.initializeGraph(graphOptions);

          graph.interfaces.paper.on({
            'cell:pointerdblclick': function(cellView) {
              if (cellView.model.attributes.name !== 'subflow') { return; }
              console.log('DOUBLE CLICKED', cellView);
              $scope.redirectToSubflowEditor(cellView);
            }
          });

          $scope.redirectToSubflowEditor = function(cellView) {
            console.log(cellView);
            $state.go('content.designer.subflowEditor', {
              parentName: $scope.flowVersion.name,
              notationName: cellView.model.attributes.params.resource || 'N/A',
              parentFlowId: $scope.flowVersion.flowId,
              parentVersionId: $scope.flowVersion.version,
              subflowNotationId: cellView.model.id
            });
          };

          $scope.publishNewFlowVersion = function() {
            if (graph.toJSON().cells.length === 0) { return; }
            var alienese = JSON.stringify(FlowConversionService.convertToAlienese(graph.toJSON()));
            $scope.version = new FlowVersion({
              flow: alienese,
              description: $scope.flowVersion.description,
              name: $scope.flowVersion.name
            });

            $scope.version.save({
              tenantId: Session.tenant.tenantId,
              flowId: $scope.flowVersion.flowId
            }, function() {
              toastr.success('New flow version successfully created.');
              $scope.flowVersion.v = parseInt($scope.flowVersion.v) + 1;
            }, function(error) {
              if (error.data.error.attribute === null) {
                toastr.error('API rejected this flow -- likely invalid Alienese.', JSON.stringify(error, null, 2));
              } else {
                toastr.error('API rejected this flow -- some other reason...', JSON.stringify(error, null, 2));
              }
            });
          };

          graph.fromJSON(FlowConversionService.convertToJoint(JSON.parse($scope.flowVersion.flow)));
          $window.spitOutAlienese = function() {
            return FlowConversionService.convertToAlienese(graph.toJSON());
          };
        }, 1000);
      }]
    };
  }

angular.module('liveopsConfigPanel').directive('flowDesigner', flowDesigner);
})();
