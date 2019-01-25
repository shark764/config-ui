'use strict';

angular.module('liveopsConfigPanel')
  .controller('flowsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.flowsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/flows?alpha');
      } else {
        $scope.flowsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/flows');
      }
    }
  ]);
