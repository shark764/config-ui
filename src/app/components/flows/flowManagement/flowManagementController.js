'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowVersion) {
      $scope.redirectToInvites();
      $scope.versions = [];

      $scope.fetch = function () {
        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.create = function() {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId,
          active: true
        });
      };
      
      Flow.prototype.postCreate = function (flow) {
        var initialVersion = new FlowVersion({
          flowId: flow.id,
          flow: '[]',
          tenantId: Session.tenant.tenantId,
          name: 'v1'
        });

        var promise = initialVersion.$save();
        promise = promise.then(function(versionResult) {
          flow.activeVersion = versionResult.version;
          return flow.save();
        });
        return promise;
      };

      $scope.$on('on:click:create', function () {
        $scope.create();
      });

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.additional = {
        versions: $scope.versions,
        flowTypes: flowTypes
      };

      $scope.fetch();
      $scope.tableConfig = flowTableConfig;
    }
  ]);
