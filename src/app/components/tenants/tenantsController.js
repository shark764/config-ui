'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', 'Session', 'TenantsService', 'RegionsService', 'UserService',
    function ($scope, $routeParams, $filter, Session, TenantsService, RegionsService, UserService) {

    $scope.tenant = {};
    $scope.error = {};

    $scope.tenants = [];
    $scope.regions = [];
    $scope.users = [];

    RegionsService.query(function (data){
      $scope.regions = data.result;
      $scope.fetch($scope.regions[0].id);
    });

    UserService.query(function(data){
      $scope.users = data.result;
    });


    $scope.fetch = function (regionId) {
      TenantsService.query( { regionId : regionId }, function (data) {
        $scope.tenants = data.result;
        var activeTenant = $filter('filter')($scope.tenants, {id : $routeParams.tenantId})[0];
        $scope.tenant = $routeParams.tenantId ? activeTenant : {  } ;

      });
    };

    $scope.saveSuccess = function () {
      $scope.tenant = {};
      $scope.fetch($scope.regions[0].id);
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
        return TenantsService.update({ tenantId : $scope.tenant.id }, { name : $scope.tenant.name, adminId: $scope.tenant.adminId, status: $scope.tenant.status }).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
          );
      }
    };

  }]);
