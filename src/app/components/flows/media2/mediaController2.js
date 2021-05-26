'use strict';

angular.module('liveopsConfigPanel')
  .controller('mediaController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {
      if(location.hash.includes('alpha')) {
        $scope.customMediaHostName = $sce.trustAsResourceUrl(config2Url + '/#/configuration/media?alpha');
      } else {
        $scope.customMediaHostName = $sce.trustAsResourceUrl(config2Url + '/#/configuration/media');
      }
    }
  ]);
