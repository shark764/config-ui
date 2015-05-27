'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', 'Session', 'TenantsService', 'RegionsService', function ($scope, $routeParams, $filter, Session, TenantsService, RegionsService) {

    $scope.tenant = {};
    $scope.error = {};

    $scope.tenants = [];
    $scope.regions = [];

    RegionsService.query(function (data){
      $scope.regions = data.result;
      $scope.fetch($scope.regions[0]);
    });

    $scope.fetch = function () {
      TenantsService.query( { regionId : 'c98f5fc0-f91a-11e4-a64e-7f6e9992be1f' }, function (data) {
        $scope.tenants = data.result;
        var activeTenant = $filter('filter')($scope.tenants, {id : $routeParams.tenantId})[0];
        $scope.tenant = $routeParams.tenantId ? activeTenant : {} ;

      });
    };

    $scope.saveSuccess = function () {
      $scope.tenant = {};
      $scope.fetch();
    };

    $scope.saveFailure = function (reason) {
      $scope.error = reason.data;
    };

    $scope.save = function () {
      if(!$scope.tenant.id){
        return TenantsService.save({ regionId : $scope.tenant.regionId }, $scope.tenant).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
          );
      } else {
        return TenantsService.update({ id : $scope.tenant.id }, { name : $scope.tenant.name }).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
          );
      }
    };

  }]);
