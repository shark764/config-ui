'use strict';

angular.module('liveopsConfigPanel').controller('contactAttributesController2', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    if (location.hash.includes('alpha')) {
      $scope.contactAttributesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/contactAttributes?alpha');
    } else {
      $scope.contactAttributesHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/contactAttributes');
    }
  }
]);