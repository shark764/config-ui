'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'readOnly', 'lodash',
    function($scope, flow, notations, data, FlowResource, FlowNotationService, FlowLibrary, readOnly, lodash) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;

      if(flow.type === 'customer' || flow.type === 'reusable'){
        FlowNotationService.setLastParticipant('titan/customer');
      }

      var parsedNotations = FlowNotationService.parseNotations(notations);

      FlowLibrary.loadData(parsedNotations);

      FlowLibrary.clearCallActivities();
      lodash.each(FlowResource.getFlows(), function(flow){
        FlowLibrary.registerCallActivity(flow);
      });
    }
  ]);
