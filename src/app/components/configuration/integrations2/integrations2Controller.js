'use strict';

angular.module('liveopsConfigPanel').controller('integrationsController2', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    if (location.hash.includes('alpha')) {
      $scope.integrationsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/integrations?alpha');
    } else {
      $scope.integrationsHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/integrations');
    }
  }
]);
