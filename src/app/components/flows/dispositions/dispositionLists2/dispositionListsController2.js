'use strict';

angular.module('liveopsConfigPanel').controller('dispositionListsController2', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    if (location.hash.includes('alpha')) {
      $scope.dispositionListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dispositionLists?alpha');
    } else {
      $scope.dispositionListsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/dispositionLists');
    }
  }
]);
