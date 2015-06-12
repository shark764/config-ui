'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'Region', 'User', 'tenantTableConfig',
    function ($scope, $stateParams, $filter, Session, Tenant, Region, User, tenantTableConfig) {

      $scope.tenants = Tenant.query( { regionId : Session.activeRegionId } );

      $scope.users = User.query();

      $scope.additional = {
        regions: $scope.regions,
        users: $scope.users
      };

      $scope.$watch('selectedTenant', function () {
        console.log($scope.selectedTenant);
      });

      $scope.createTenant = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId
        });
      };
 

      $scope.tableConfig = tenantTableConfig;
  }]);
