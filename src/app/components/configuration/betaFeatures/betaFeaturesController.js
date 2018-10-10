'use strict';

angular.module('liveopsConfigPanel')
  .controller('betaFeaturesController', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      $scope.betaFeaturesHostname = $sce.trustAsResourceUrl(config2Url + '/#/betaFeatures');
    }
  ]);
