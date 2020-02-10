'use strict';

angular.module('liveopsConfigPanel')
  .controller('customAttributesController2', ['$scope', '$sce', 'config2Url',
    function ($scope, $sce, config2Url) {

      if(location.hash.includes('alpha')) {
        $scope.customAttributesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/customAttributes?alpha');
      } else {
        $scope.customAttributesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/customAttributes');
      }

    }
  ]);