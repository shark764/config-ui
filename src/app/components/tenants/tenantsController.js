'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$routeParams', '$filter', '$location', 'Session', 'Tenant', 'Region', 'User', 'tenantTableConfig',
    function ($scope, $routeParams, $filter, $location, Session, Tenant, Region, User, tenantTableConfig) {
      $scope.tenants = Tenant.query( { regionId : Session.activeRegionId } );
      $scope.users = User.query();

      $scope.additional = {
        regions: $scope.regions,
        users: $scope.users
      };

      $scope.createTenant = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId
        });
      };

      $scope.tableConfig = tenantTableConfig;
  }]);
