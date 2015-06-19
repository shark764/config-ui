'use strict';

angular.module('liveopsConfigPanel')
  .controller('IntegrationsController', ['$scope', '$state', 'Session', 'Integration', 'integrationTableConfig',
    function($scope, $state, Session, Integration, integrationTableConfig) {

      $scope.fetch = function() {
        $scope.integrations = Integration.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant', $scope.fetch);

      $scope.$on('on:click:create', function() {
        $scope.selectedIntegration = new Integration({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.tableConfig = integrationTableConfig;
    }
  ]);
