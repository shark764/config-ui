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

      lodash.each(FlowResource.getFlows(), function(flow){
        lodash.each(FlowResource.getVersions(flow.id), function(version){
          FlowLibrary.registerCallActivity(flow, version);
        });
      });

      $scope.$on('$destroy', function(){
        console.log('Kill it all!');
        FlowLibrary.clearData();
      })
    }
  ]);
