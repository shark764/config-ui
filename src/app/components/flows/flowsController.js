'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$routeParams', '$filter', 'Session', 'Flow',
    function ($scope, $routeParams, $filter, Session, Flow) {

      $scope.flow = new Flow({});

      $scope.flows = [];
      $scope.tenants = [];

      $scope.$on('$routeUpdate', function () {
        $scope.setFlow($routeParams.id);
      });

      $scope.flows = Flow.query( { tenantId: Session.tenantId });

      $scope.setFlow = function (id) {
        var activeFlow = $filter('filter')($scope.flows, {id : id})[0];
        $scope.flow = id ? activeFlow : {  } ;
      };

      $scope.fetch = function () {
        $scope.flows = Flow.query( { tenantId: Session.tenantId });
      };

      $scope.saveSuccess = function (response) {
        $scope.flow = {};
        $scope.fetch();
      };

      $scope.saveFailure = function (reason) {
        $scope.error = reason.data;
      };

      $scope.save = function () {
        $scope.flow.save({id : $scope.flow.id, tenantId : Session.tenantId}, $scope.saveSuccess, $scope.saveFailure);
      };

    }]);
