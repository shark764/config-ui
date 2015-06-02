'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', 'Session', 'TenantsService', 'RegionsService', 'UserService',
    function ($scope, $routeParams, $filter, Session, TenantsService, RegionsService, UserService) {

    $scope.tenant = {};
    $scope.error = {};

    $scope.tenants = {};
    $scope.regions = {};
    $scope.users = {};

    $scope.$on('$routeUpdate', function () {
      $scope.setTenant($routeParams.id);
    });

    $scope.regions = RegionsService.query(function (data){
      $scope.fetchTenants($scope.regions.result[0].id);
    });

    $scope.users = UserService.query();

    $scope.setTenant = function (id) {
			var activeTenant = $filter('filter')($scope.tenants.result, {id : id}, true)[0];

      $scope.tenant = id ? activeTenant : {  } ;
      Session.tenantId = id ? id : '' ;
    };

    $scope.fetchTenants = function (regionId) {
      $scope.tenants = TenantsService.query( { regionId : regionId }, function (data) {
        $scope.setTenant($routeParams.id);
      });
    };

    $scope.saveSuccess = function () {
      $scope.tenant = {};
      $scope.fetchTenants($scope.regions.result[0].id);
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
        return TenantsService.update({ tenantId : $scope.tenant.id }, { name : $scope.tenant.name, adminUserId: $scope.tenant.adminUserId, status: $scope.tenant.status }).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
          );
      }
    };

  }]);
