'use strict';

angular.module('liveopsConfigPanel')
  .controller('reasonsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {

      if(location.hash.includes('alpha')) {
        $scope.reasonsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/reasons?alpha');
      } else {
        $scope.reasonsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/reasons');
      }

    }
  ]);
