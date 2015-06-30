'use strict';

angular.module('liveopsConfigPanel')
  .controller('FlowManagementController', ['$scope', '$state', 'Session', 'Flow', 'flowTableConfig', 'flowTypes', 'FlowVersion',
    function ($scope, $state, Session, Flow, flowTableConfig, flowTypes, FlowVersion) {
      var self = this;
      $scope.redirectToInvites();
      $scope.versions = [];

      $scope.fetch = function () {
        $scope.versions = [];

        $scope.flows = Flow.query({
          tenantId: Session.tenant.tenantId
        }, function () {
          angular.forEach($scope.flows, function (value) {
            if (value.activeVersion) {
              $scope.updateVersionName(value);
            }
          });
        });
      };

      $scope.updateVersionName = function (flow) {
        return FlowVersion.get({
          version: flow.activeVersion,
          flowId: flow.id,
          tenantId: Session.tenant.tenantId
        }, function (data) {
          flow.activeVersionName = data.name;
        });
      };

      Flow.prototype.postCreate = function (flow) {
        var initialVersion = new FlowVersion({
          flowId: flow.id,
          flow: '[]',
          tenantId: Session.tenant.tenantId,
          name: 'v1'
        });

        var promise = initialVersion.save();
        promise.then(function(versionResult) {
          flow.activeVersion = versionResult.version;
          return flow.save(function () {
            $scope.updateVersionName(flow);
          });
        })
      };

      Flow.prototype.postUpdate = function(flow) {
        return $scope.updateVersionName(flow).$promise;
      };

      $scope.$on('on:click:create', function () {
        $scope.selectedFlow = new Flow({
          tenantId: Session.tenant.tenantId,
          active: true
        });
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