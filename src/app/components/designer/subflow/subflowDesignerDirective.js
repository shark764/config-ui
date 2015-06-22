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
          var graph = JointInitService.graph(1280, 800, 20, true, true, false, new joint.shapes.liveOps.link(), 0, true, [], '#stencil-container', '#paper-container', '#inspector-container');

          $scope.saveSubflow = function() {
            SubflowCommunicationService.add({
              id: $scope.subflow.id,
              graphJSON: JSON.stringify(graph.toJSON()),
              parentName: $scope.subflow.parentName,
              parentFlowId: $scope.subflow.parentFlowId,
              parentVersionId: $scope.subflow.parentVersionId
            });

            $state.go('content.designer.editor', {
              flowId: $scope.subflow.parentFlowId,
              versionId: $scope.subflow.parentVersionId,
              version: 'v99'
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
