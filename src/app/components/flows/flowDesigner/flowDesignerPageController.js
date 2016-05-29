'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'draft', 'platformFlow', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'lodash',
    function($scope, flow, notations, draft, platformFlow, FlowResource, FlowNotationService, FlowLibrary, lodash) {
      $scope.flow = flow;
      $scope.draft = draft;

      FlowResource.setPlatformFlow(platformFlow);

      if(flow.type === 'customer' || flow.type === 'reusable'){
        FlowNotationService.setLastParticipant('titan/customer');
      }

      var parsedNotations = FlowNotationService.parseNotations(notations);

      FlowLibrary.loadData(parsedNotations, platformFlow);

      lodash.each(FlowResource.getFlows(), function(flow){
        var opts = _.findWhere(parsedNotations.flows, {flow: flow.id});

        lodash.each(FlowResource.getVersions(flow.id), function(version){
          if(opts){
            FlowLibrary.registerCallActivity(flow, version, opts);
          }
          else{
            FlowLibrary.registerCallActivity(flow, version, {stencilGroup: 'reusable', versionSelect: true});
          }
        });
      });

      $scope.$on('$destroy', function(){
        FlowLibrary.clearData();
      });
    }
  ]);
