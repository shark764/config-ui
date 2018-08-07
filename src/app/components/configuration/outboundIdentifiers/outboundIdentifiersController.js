'use strict';

angular.module('liveopsConfigPanel')
  .controller('outboundIdentifiersController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.outboundIdentifiersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/outboundIdentifiers');
    }
  ]);
