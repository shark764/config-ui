'use strict';

angular.module('liveopsConfigPanel')
  .controller('flowDebuggerController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.flowDebuggerHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/flowDebugger?alpha');
      } else {
        $scope.flowDebuggerHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/flowDebugger');
      }
    }
  ]);
