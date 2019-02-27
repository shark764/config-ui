'use strict';

angular.module('liveopsConfigPanel')
  .controller('dispatchMappingsController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {

      if(location.hash.includes('alpha')) {
        $scope.dispatchMappingsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dispatchMappings?alpha');
      } else {
        $scope.dispatchMappingsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dispatchMappings');
      }

    }
  ]);
