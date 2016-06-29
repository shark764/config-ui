'use strict';

angular.module('liveopsConfigPanel')
  .controller('ViewerPageController', ['$scope', 'flow', 'platformFlow', 'notations', 'data', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'lodash',
    function($scope, flow, platformFlow, notations, data, FlowResource, FlowNotationService, FlowLibrary, lodash) {
      $scope.flow = flow;
      $scope.flowData = data;

      FlowResource.setPlatformFlow(platformFlow);

      var parsedNotations = FlowNotationService.parseNotations(notations);

      FlowLibrary.loadData(parsedNotations);

      lodash.each(FlowResource.getFlows(), function(flow){
        var opts = _.findWhere(parsedNotations.flows, {flow: flow.id});

        lodash.each(FlowResource.getVersions(flow.id), function(version){
          if(opts){
            FlowLibrary.registerCallActivity(flow, version, opts);
          }
          else{
            FlowLibrary.registerCallActivity(flow, version, {stencilGroup: 'reusable'});
          }
        });
      });

      $scope.$on('$destroy', function(){
        FlowLibrary.clearData();
      });
    }
  ]);
