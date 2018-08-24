'use strict';

angular.module('liveopsConfigPanel')
  .controller('statisticsController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.statisticsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/customMetrics');
    }
  ]);
