'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig',
    function ($scope, $state, Session, Flow, flowTableConfig) {

      $scope.redirectToInvites();

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

      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
}]);
