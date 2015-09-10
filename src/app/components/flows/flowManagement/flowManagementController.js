'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion', 'BulkAction',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowVersion, BulkAction) {
      $scope.versions = [];

      $scope.fetchFlows = function () {
        return Flow.cachedQuery({
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
          flow.activeFlow = versionResult;
          return flow.save();
        });
        return promise;
      };

      $scope.$on('table:on:click:create', function () {
        $scope.create();
      });

      $scope.additional = {
        versions: $scope.versions,
        flowTypes: flowTypes
      };
      
      $scope.tableConfig = flowTableConfig;
      $scope.bulkActions = {
          setFlowStatus: new BulkAction()
        };
    }
  ]);
