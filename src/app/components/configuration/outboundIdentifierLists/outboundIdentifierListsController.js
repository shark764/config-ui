'use strict';

angular.module('liveopsConfigPanel').controller('outboundIdentifierListsController', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    if (location.hash.includes('alpha')) {
      $scope.outboundIdentifierListsHostname = $sce.trustAsResourceUrl(
        config2Url + '/#/configuration/outboundIdentifierLists?alpha'
      );
    } else {
      $scope.outboundIdentifierListsHostname = $sce.trustAsResourceUrl(
        config2Url + '/#/configuration/outboundIdentifierLists'
      );
    }
  }
]);
