
'use strict';

angular.module('liveopsConfigPanel').controller('flowDebugLogsController', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    $scope.flowDebugLogsHostname = $sce.trustAsResourceUrl(config2Url + '/#/flowDebugLogs');
  }
]);
