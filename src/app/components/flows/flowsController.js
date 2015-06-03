'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$routeParams', '$filter', 'Session', 'TenantsService', 'FlowsService', 'RegionsService', 'UserService',
    function ($scope, $routeParams, $filter, Session, TenantsService, FlowsService, RegionsService, UserService) {

      $scope.flow = {};

      $scope.flows = [];
      $scope.tenants = [];

      RegionsService.query(function (data){
        $scope.regions = data.result;
        $scope.fetch($scope.regions[0].id);
      });

      $scope.setTenant = function (id) {
        var activeTenant = $filter('filter')($scope.tenants, {id : id})[0];
        $scope.tenant = id ? activeTenant : {  } ;
      };

      $scope.fetch = function (regionId) {
        TenantsService.query( { regionId : regionId }, function (data) {
          $scope.tenants = data.result;
          $scope.setTenant($routeParams.id);
        });

        FlowsService.query( { tenantId: Session.tenantId }, function (data){
          console.log(Session);
         console.log(data);
         $scope.flows = data.result;
       });
      };

      $scope.getTenantName = function (tenantId) {
        var tenantName = tenantId;
        // TenantsService.query( { id: tenantId }, function (data){
        //   tenantName = data.result.name;
        // });
        return tenantName;
      }

      $scope.saveSuccess = function (response) {
        console.log("success");
        console.log(response);

        $scope.flow = {};
        $scope.fetch($scope.regions[0].id);
      };

      $scope.saveFailure = function (reason) {
        console.log("error");
        console.log(reason);
        $scope.error = reason.data;
      };

      $scope.save = function () {
        if(!$scope.flow.id){
          return FlowsService.save({ tenantId : $scope.flow.tenantId }, $scope.flow).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
            );
        } else {
          return FlowsService.update({ tenantId: $scope.flow.tenantId, flowId : $scope.flow.id }, $scope.flow).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
            );
        }
      };

    }]);
