'use strict';

angular.module('liveopsConfigPanel')
  .controller('ViewerPageController', ['$scope', 'flow', 'notations', 'data', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'lodash',
    function($scope, flow, notations, data, FlowResource, FlowNotationService, FlowLibrary, lodash) {
      $scope.flow = flow;
      $scope.flowData = data;

      var parsedNotations = FlowNotationService.parseNotations(notations);

      FlowLibrary.loadData(parsedNotations);

      FlowLibrary.clearCallActivities();
      lodash.each(FlowResource.getFlows(), function(flow){
        FlowLibrary.registerCallActivity(flow);
      });
    }
  ]);
