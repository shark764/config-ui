'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$routeParams', '$filter', 'Session', 'TenantsService', 'FlowsService', 'RegionsService', 'UserService',
    function ($scope, $routeParams, $filter, Session, TenantsService, FlowsService, RegionsService, UserService) {

      $scope.flow = {};

      $scope.flows = [];
      $scope.tenants = [];

      $scope.$on('$routeUpdate', function () {
        $scope.setFlow($routeParams.id);
      });

      RegionsService.query(function (data){
        $scope.regions = data.result;
        $scope.fetch($scope.regions[0].id);
      });

      $scope.setFlow = function (id) {
        var activeFlow = $filter('filter')($scope.flows.result, {id : id})[0];
        $scope.flow = id ? activeFlow : {  } ;
      };

      $scope.fetch = function (regionId) {
        $scope.flows = FlowsService.query( { tenantId: Session.tenantId });
      };

      $scope.saveSuccess = function (response) {
        $scope.flow = {};
        $scope.fetch($scope.regions[0].id);
      };

      $scope.saveFailure = function (reason) {
        $scope.error = reason.data;
      };

      $scope.trimmedFlow = function(flowData) {
        var data = {
          tenantId: flowData.tenantId,
          description: flowData.description,
          name: flowData.name,
          activeVersion: flowData.id,
          active: flowData.active,
          channelType: (flowData.channelType ? flowData.channelType : "")
        };

        return data;
      };

      $scope.save = function () {
        if(!$scope.flow.id){
          return FlowsService.save({ tenantId : Session.tenantId }, $scope.flow).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
            );
        } else {
          var trimmedFlow = $scope.trimmedFlow($scope.flow);

          return FlowsService.update({ tenantId: Session.tenantId, flowId : $scope.flow.id }, trimmedFlow).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
            );
        }
      };

    }]);
