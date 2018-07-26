'use strict';

angular.module('liveopsConfigPanel')
  .controller('InteractionMonitoringController', ['$scope', '$location', '$sce', 'config2Url',
    function ($scope, $location, $sce, config2Url) {
      $scope.interactionMonitoringHostname = $sce.trustAsResourceUrl(config2Url + '/#/interactionMonitoring');

    }
  ]);
