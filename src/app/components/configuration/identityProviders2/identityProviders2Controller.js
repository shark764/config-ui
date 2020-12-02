'use strict';

angular.module('liveopsConfigPanel').controller('identityProvidersController2', [
  '$scope',
  '$sce',
  'config2Url',
  function($scope, $sce, config2Url) {
    if (location.hash.includes('alpha')) {
      $scope.identityProvidersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/identityProviders?alpha');
    } else {
      $scope.identityProvidersHostname = $sce.trustAsResourceUrl(config2Url + '/#/configuration/identityProviders');
    }
  }
]);
