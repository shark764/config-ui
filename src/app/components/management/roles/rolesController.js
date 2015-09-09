'use strict';

angular.module('liveopsConfigPanel')
  .controller('RolesController', ['$scope', 'Session', 'roleTableConfig', 'BulkAction', 'TenantRole',
    function($scope, Session, roleTableConfig, BulkAction, TenantRole) {
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
      
      $scope.$on('table:on:click:create', function() {
        $scope.create();
      });
    }
  ]);
