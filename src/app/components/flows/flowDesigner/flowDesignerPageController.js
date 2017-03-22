'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'draft', 'tenantSettings', 'FlowResource', 'FlowNotationService', 'FlowLibrary', 'lodash',
    function($scope, flow, notations, draft, tenantSettings, FlowResource, FlowNotationService, FlowLibrary, lodash) {
      $scope.flow = flow;
      $scope.draft = draft;
      $scope.tenantSettings = tenantSettings;

      var platformFlow = lodash.find(tenantSettings, {name: 'platform-defaults-flow'}).value;

      FlowResource.setPlatformFlow(platformFlow);

      if(flow.type === 'customer' || flow.type === 'reusable'){
        FlowNotationService.setLastParticipant('titan/customer');
      }

      var parsedNotations = FlowNotationService.parseNotations(notations);
      FlowLibrary.loadData(parsedNotations, platformFlow);

      lodash.each(FlowResource.getFlows(), function(flow){
        var opts = lodash.find(parsedNotations.flows, {flow: flow.id});

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
