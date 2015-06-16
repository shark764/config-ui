'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowsController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig',
    function ($scope, $state, Session, Flow, flowTableConfig) {

      $scope.redirectToInvites();

      $scope.fetch = function () {
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

      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
    }
  ]);
