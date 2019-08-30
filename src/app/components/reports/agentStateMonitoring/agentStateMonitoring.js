'use strict';

angular.module('liveopsConfigPanel').controller('AgentStateMonitoringController', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    $scope.agentStateMonitoringHostname = $sce.trustAsResourceUrl(config2Url + '/#/agentStateMonitoring');
  }
]);
