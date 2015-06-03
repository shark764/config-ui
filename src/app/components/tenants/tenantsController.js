'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', 'Session', 'Tenant', 'RegionsService', 'User',
    function ($scope, $routeParams, $filter, Session, Tenant, RegionsService, User) {

    $scope.tenant = {};
    $scope.error = {};

    $scope.tenants = {};
    $scope.regions = {};
    $scope.users = {};

    $scope.$on('$routeUpdate', function () {
      $scope.setTenant($routeParams.id);
    });

    $scope.regions = RegionsService.query(function (data){
      $scope.fetchTenants($scope.regions[0].id);
    });

    $scope.users = User.query();

    $scope.setTenant = function (id) {
      if(id){
        var activeTenant = $filter('filter')($scope.tenants, {id : id})[0];
        $scope.tenant = id ? activeTenant : {  } ;
      } else {
        $scope.tenant = new Tenant();
        $scope.tenants.push($scope.tenant);
      }

    };

    $scope.fetchTenants = function (regionId) {
      $scope.tenants = Tenant.query( { regionId : regionId }, function (data) {
        $scope.setTenant($routeParams.id);
      });
    };

    $scope.saveSuccess = function () {
      $scope.tenant = {};
      $scope.fetchTenants($scope.regions[0].id);
    };

    $scope.saveFailure = function (reason) {
      $scope.error = reason.data;
    };

    $scope.save = function () {
      $scope.tenant.save({id : $scope.tenant.id}, null, function(error) {
        $scope.error = error.data;
      });
    };

  }]);
