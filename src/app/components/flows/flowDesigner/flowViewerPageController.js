'use strict';

angular.module('liveopsConfigPanel')
  .controller('ViewerPageController', ['$scope', 'flow', 'tenantSettings', 'notations', 'data', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'lodash',
    function($scope, flow, tenantSettings, notations, data, FlowResource, FlowNotationService, FlowLibrary, lodash) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.tenantSettings = tenantSettings;

      var platformFlow = lodash.find(tenantSettings, {name: 'platform-defaults-flow'}).value;

      FlowResource.setPlatformFlow(platformFlow);

      var parsedNotations = FlowNotationService.parseNotations(notations);

      FlowLibrary.loadData(parsedNotations);

      lodash.each(FlowResource.getFlows(), function(flow){
        var opts = lodash.find(parsedNotations.flows, {flow: flow.id});

        lodash.each(FlowResource.getVersions(flow.id), function(version){
          if(opts){
            FlowLibrary.registerCallActivity(flow, version, opts);
          }
          else{
            FlowLibrary.registerCallActivity(flow, version, {stencilGroup: 'reusable'});
          }
        });
      });
    }
  ]);
