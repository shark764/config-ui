'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig',
    function ($scope, $state, Session, Flow, flowTableConfig) {

      if(!Session.tenant.tenantId){
          $state.transitionTo('management.users');
          alert('No tenant set; redirect to management');
      }

      $scope.fetch = function () {
        $scope.flows = Flow.query( { tenantId: Session.tenant.tenantId }, function(){
          if($scope.flows.length > 0){
            $scope.selectedFlow = $scope.flows[0];
          }
        });
      };

      $scope.createFlow = function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant.tenantId', function () {
        $scope.fetch();
      });

      $scope.$on('created:resource:tenants:' + Session.tenant.tenantId + ':flows', function(event, resource){
        $scope.flows.push(resource);
        $scope.selectedFlow = resource;
      })

      $scope.createFlow();
      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
}]);
