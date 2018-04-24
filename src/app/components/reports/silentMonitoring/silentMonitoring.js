'use strict';

angular.module('liveopsConfigPanel')
  .controller('SilentMonitoringController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.interactionMonitoringHostname = $sce.trustAsResourceUrl(config2Url + '/#/interactionMonitoring');
    }
  ]);
