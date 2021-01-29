'use strict';

angular.module('liveopsConfigPanel').controller('capacityRulesController2', [
  '$scope',
  '$sce',
  'config2Url',
  function( $scope, $sce, config2Url ) {
    if (location.hash.includes('alpha')) {
      $scope.capacityRulesHostname = $sce.trustAsResourceUrl( config2Url + '/#/configuration/capacityRules?alpha' );
    } else {
      $scope.capacityRulesHostname = $sce.trustAsResourceUrl( config2Url + '/#/configuration/capacityRules' );
    }
  }
]);