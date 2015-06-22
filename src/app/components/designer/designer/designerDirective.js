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
      controller: ['$scope', '$element', '$attrs', '$window', '$timeout', 'JointInitService', 'FlowConversionService', 'FlowNotationService', 'FlowVersion', 'Session', 'toastr', function($scope, $element, $attrs, $window, $timeout, JointInitService, FlowConversionService, FlowNotationService, FlowVersion, Session, toastr) {

        $timeout(function() {
          var graph = JointInitService.graph(1280, 800, 20, true, true, false, new joint.shapes.liveOps.link(), 0, true, [], '#stencil-container', '#paper-container', '#inspector-container');

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
            return JSON.stringify(FlowConversionService.convertToAlienese(graph.toJSON()));
          };
        }, 1000);
      }]
    };
  }

angular.module('liveopsConfigPanel').directive('flowDesigner', flowDesigner);
})();
