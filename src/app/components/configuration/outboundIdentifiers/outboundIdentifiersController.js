'use strict';

angular.module('liveopsConfigPanel')
  .controller('outboundIdentifiersController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.outboundIdentifiersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/outboundIdentifiers?alpha');
      } else {
        $scope.outboundIdentifiersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/outboundIdentifiers');
      }
    }
  ]);
