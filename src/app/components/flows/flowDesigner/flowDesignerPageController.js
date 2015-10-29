'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'readOnly',
    function($scope, flow, notations, data, FlowResource, FlowNotationService, FlowLibrary, readOnly) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;

      if(flow.type === 'customer' || flow.type === 'reusable'){
        FlowNotationService.setLastParticipant('titan/customer');
      }

      var parsedNotations = FlowLibrary.parseNotations(notations);

      FlowLibrary.loadData(parsedNotations);

      FlowLibrary.clearCallActivities();
      _.each(FlowResource.getFlows(), function(flow){
        FlowLibrary.registerCallActivity(flow);
      });


      $scope.$on('$destroy', function() {
        var designerKeys = [
          'delete',
          'super',
          'ctrl',
          'backspace',
          'z',
          'y',
          'c',
          'v',
          '=',
          '-'
        ];

        //Unbind Flow Designer keys
        designerKeys.forEach(function(key) { KeyboardJS.clear(key); });
      });
    }
  ]);
