'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$routeParams', '$filter', 'Session', 'Flow', 'flowTableConfig', 'flowSidebarConfig',
    function ($scope, $routeParams, $filter, Session, Flow, flowTableConfig, flowSidebarConfig) {
      $scope.tableConfig = flowTableConfig;
      $scope.flow = new Flow({});

      $scope.flows = [];
      $scope.tenants = [];

      $scope.$on('$routeUpdate', function () {
        $scope.setFlow($routeParams.id);
      });
      $scope.flows = Flow.query( { tenantId: Session.tenant.id });

      $scope.setFlow = function (id) {
        var activeFlow = $filter('filter')($scope.flows, {id : id})[0];
        $scope.flow = id ? activeFlow : {  } ;
      };

      $scope.fetch = function () {
        $scope.flows = Flow.query( { tenantId: Session.tenant.id });
      };
      
      $scope.createFlow = function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.id
        });
      };
      
      $scope.sidebarConfig = flowSidebarConfig;
}]);
