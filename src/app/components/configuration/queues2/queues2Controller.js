'use strict';

angular.module('liveopsConfigPanel')
  .controller('queuesController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.queuesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/queues?alpha');
      } else {
        $scope.queuesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/queues');
      }
    }
  ]);
