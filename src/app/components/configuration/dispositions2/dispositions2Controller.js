'use strict';

angular.module('liveopsConfigPanel')
  .controller('dispositionsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.dispositionsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dispositions?alpha');
      } else {
        $scope.dispositionsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dispositions');
      }
    }
  ]);
