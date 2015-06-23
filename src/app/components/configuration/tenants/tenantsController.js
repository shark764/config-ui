'use strict';

angular.module('liveopsConfigPanel')
  .controller('TenantsController', ['$scope', '$stateParams', '$filter', 'Session', 'Tenant', 'User', 'tenantTableConfig',
    function($scope, $stateParams, $filter, Session, Tenant, User, tenantTableConfig) {

      $scope.create = function() {
        $scope.selectedTenant = new Tenant({
          regionId: Session.activeRegionId
        });
      }

      $scope.fetch = function() {
        $scope.tenants = Tenant.query({
          regionId: Session.activeRegionId
        }, function() {
          if (!$scope.tenants.length) {
            $scope.create();
          }
        });

        $scope.users = User.query();
      }

      $scope.$on('on:click:create', function() {
        $scope.create();
      });

      $scope.tableConfig = tenantTableConfig;
      $scope.fetch();

      $scope.additional = {
        users: $scope.users
      };
    }
  ]);
