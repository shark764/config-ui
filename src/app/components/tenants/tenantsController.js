'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', '$location', 'Session', 'Tenant', 'Region', 'tenantTableConfig',
    function ($scope, $routeParams, $filter, $location, Session, Tenant, Region, tenantTableConfig) {
      $scope.regions = Region.query(function (){
        $scope.tenants = Tenant.query( { regionId : $scope.regions[0].id } );
      });
      
      $scope.createTenant = function() {
        $scope.selectedTenant = new Tenant({
          status: true
        });
      };
      
      $scope.tableConfig = tenantTableConfig;
  }]);
