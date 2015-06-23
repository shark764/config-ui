(function() {
'use strict';
function subflowDesigner() {
    return {
      scope: {
        subflow: '=subflow'
      },
      restrict: 'E',
      templateUrl: 'app/components/designer/subflow/subflowDesignerDirective.html',
      replace: true,
      link: function() {},
      controller: ['$scope', '$element', '$attrs', '$window', '$timeout', 'JointInitService', 'SubflowCommunicationService', '$state',function($scope, $element, $attrs, $window, $timeout, JointInitService, SubflowCommunicationService, $state) {
        console.log('SF in directive:', $scope.subflow);
        $timeout(function() {

          $scope.subflowName = SubflowCommunicationService.currentFlowNotationName;
          $scope.parentName = $scope.subflow.parentName;
          $scope.flowId = $scope.subflow.parentFlowId;
          $scope.versionId = $scope.subflow.parentVersionId;

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

          $scope.saveSubflow = function() {
            SubflowCommunicationService.add({
              id: $scope.subflow.id,
              graphJSON: JSON.stringify(graph.toJSON()),
              parentName: $scope.subflow.parentName,
              parentFlowId: $scope.subflow.parentFlowId,
              parentVersionId: $scope.subflow.parentVersionId
            });

            console.log(SubflowCommunicationService);

            $state.go('content.designer.editor', {
              flowId: SubflowCommunicationService.currentVersionContext.flowId,
              versionId: SubflowCommunicationService.currentVersionContext.version,
              version: 'TO BE FIXED'
            });
          };

          if ($scope.subflow.graphJSON !== '{"cells":[]}') {
            graph.fromJSON(JSON.parse($scope.subflow.graphJSON));
          }
        }, 1000);

      }]
    };
  }

angular.module('liveopsConfigPanel').directive('subflowDesigner', subflowDesigner);
})();
