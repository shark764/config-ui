'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'User', 'tenantTableConfig', 'BulkAction',
    function($scope, $stateParams, $filter, Session, Tenant, User, tenantTableConfig, BulkAction) {

      $scope.create = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId,
          adminUserId: Session.user.id
        });
      };

      $scope.fetch = function() {
        $scope.tenants = Tenant.query({
          regionId: Session.activeRegionId
        });
        
        //TODO users based on selected tenant?
        $scope.users = User.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.showBulkActions = false;
        $scope.create();
      });

      $scope.tableConfig = tenantTableConfig;
      $scope.fetch();

      $scope.additional = {
        users: $scope.users
      };
      
      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });
      
      $scope.bulkActions = {
        setTenantStatus: new BulkAction()
      };
    }
  ]);
