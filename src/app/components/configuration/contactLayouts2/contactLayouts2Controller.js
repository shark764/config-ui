'use strict';

angular.module('liveopsConfigPanel').controller('contactLayoutsController2', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    if (location.hash.includes('alpha')) {
      $scope.contactLayoutsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/contactLayouts?alpha');
    } else {
      $scope.contactLayoutsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/contactLayouts');
    }
  }
]);