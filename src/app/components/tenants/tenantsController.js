'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', 'Session', 'Tenant', 'Region', '$location',
    function ($scope, $routeParams, $filter, Session, Tenant, Region, $location) {

      $scope.tenant = {};
      $scope.tenants = {};
      $scope.regions = {};
  
      $scope.$on('$routeUpdate', function () {
        $scope.setTenant($routeParams.id);
      });
      
      $scope.$on('tenant:cancel', function () {
        $location.search({id: null});
      //TODO: undo changes to scope selectedUser without a query
        $scope.tenant.$get({id: $scope.tenant.id});
      });
  
      $scope.regions = Region.query(function (){
        $scope.fetchTenants($scope.regions[0].id);
      });
  
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
        $scope.tenants = Tenant.query( { regionId : regionId }, function () {
          $scope.setTenant($routeParams.id);
        });
      };
  }]);
