'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'draft', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'lodash',
    function($scope, flow, notations, draft, FlowResource, FlowNotationService, FlowLibrary, lodash) {
      $scope.flow = flow;
      $scope.draft = draft;

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
