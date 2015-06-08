'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$routeParams', '$filter', 'Session', 'Tenant', 'Flow', 'Region', 'User',
    function ($scope, $routeParams, $filter, Session, Tenant, Flow, Region, User) {

      $scope.flow = new Flow({});

      $scope.flows = [];
      $scope.tenants = [];

      $scope.$on('$routeUpdate', function () {
        $scope.setFlow($routeParams.id);
      });

      $scope.regions = Region.query(function (data){
        $scope.fetch($scope.regions[0].id);
      });

      $scope.setFlow = function (id) {
        var activeFlow = $filter('filter')($scope.flows, {id : id})[0];
        $scope.flow = id ? activeFlow : {  } ;
      };

      $scope.fetch = function (regionId) {
        $scope.flows = Flow.query( { tenantId: Session.tenant.id });
      };

      $scope.saveSuccess = function (response) {
        $scope.flow = {};
        $scope.fetch($scope.regions[0].id);
      };

      $scope.saveFailure = function (reason) {
        $scope.error = reason.data;
      };

      $scope.save = function () {
        $scope.flow.save({id : $scope.flow.id, tenantId : Session.tenant.id}, $scope.saveSuccess, $scope.saveFailure);
      };

    }]);
