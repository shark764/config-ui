'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes) {

      $scope.redirectToInvites();
      $scope.versions = [];

      $scope.fetch = function () {
        $scope.versions = [];

        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.createFlow = function () {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$watch('Session.tenant', function () {
        $scope.fetch();
      });

      $scope.additional = {
        versions: $scope.versions,
        flowTypes: flowTypes
      };

      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
    }
  ]);
