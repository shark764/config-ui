'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', '$location', 'Session', 'Tenant', 'Region', 'User', 'tenantTableConfig',
    function ($scope, $routeParams, $filter, $location, Session, Tenant, Region, User, tenantTableConfig) {
      $scope.regions = Region.query(function (){
        $scope.tenants = Tenant.query( { regionId : Session.activeRegionId } );
      });

      $scope.users = User.query();

      $scope.additional = {
        regions: $scope.regions,
        users: $scope.users
      };

      $scope.createTenant = function() {
        $scope.selectedTenant = new Tenant({
          regionId: $scope.regions[0].id
        });
      };

      $scope.tableConfig = tenantTableConfig;
  }]);
