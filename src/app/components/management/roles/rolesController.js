'use strict';

angular.module('liveopsConfigPanel')
  .controller('RolesController', ['$scope', 'Session', 'roleTableConfig', 'BulkAction', 'TenantRole', 'loEvents',
    function($scope, Session, roleTableConfig, BulkAction, TenantRole, loEvents) {
      $scope.forms = {};
      $scope.roleTableConfig = roleTableConfig;

      $scope.fetchTenantRoles = function() {
        return TenantRole.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.create = function() {
        $scope.selectedTenantRole = new TenantRole({
          tenantId: Session.tenant.tenantId,
          permissions: []
        });
      };

      $scope.submit = function() {
        return $scope.selectedTenantRole.save();
      };
      
      $scope.$on(loEvents.tableControls.itemCreate, function() {
        $scope.create();
      });
    }
  ]);
