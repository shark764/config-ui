'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', 'Session', 'Flow', 'flowTableConfig', 'flowSidebarConfig',
    function ($scope, Session, Flow, flowTableConfig, flowSidebarConfig) {
      $scope.fetch = function () {
        $scope.flows = Flow.query( { tenantId: Session.tenant.id }, function(){
          $scope.selectedFlow = $scope.flows[0];
        });
      };
      
      $scope.createFlow = function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.id
        });
      };
      
      $scope.additional = {
        versions : function(){
          return Version.query( { tenantId: Session.tenant.id, flowId: $scope.selectedFlow.Id });
        },
        createVersion : function(name){
          var newVersion = new Version({name: name});
          newVersion.save({tenantId : Session.tenant.id, flowId: $scope.selectedFlow.Id});
        }
      };
      
      $scope.$watch('Session.tenant.id', function () {
        $scope.fetch();
      });
      
      $scope.$on('created:resource:tenants:' + Session.tenant.id + ':flows', function(event, resource){
        $scope.flows.push(resource);
        $scope.selectedFlow = resource;
      })
      
      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
      $scope.sidebarConfig = flowSidebarConfig;
}]);
