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

      $scope.fetchTenants = function() {
        return Tenant.cachedQuery({
          regionId: Session.activeRegionId
        });
      };

      $scope.fetchUsers = function() {
        return User.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function() {
        $scope.showBulkActions = false;
        $scope.create();
      });

      $scope.tableConfig = tenantTableConfig;

      $scope.additional = {
        fetchUsers: $scope.fetchUsers
      };

      $scope.$on('table:resource:selected', function() {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function() {
        $scope.showBulkActions = true;
      });

      $scope.bulkActions = {
        setTenantStatus: new BulkAction()
      };
    }
  ]);
