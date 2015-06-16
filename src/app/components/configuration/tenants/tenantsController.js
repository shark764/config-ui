'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'User',
    function ($scope, $stateParams, $filter, Session, Tenant, User, tenantTableConfig) {

      $scope.tenants = Tenant.query( { regionId : Session.activeRegionId } );

      $scope.users = User.query();

      $scope.additional = {
        users: $scope.users
      };

      $scope.createTenant = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId
        });
      };
  }]);
