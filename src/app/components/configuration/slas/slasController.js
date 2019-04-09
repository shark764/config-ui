'use strict';

angular.module( 'liveopsConfigPanel' ).controller( 'slasController', [
  '$scope',
  '$sce',
  'config2Url',
  function( $scope, $sce, config2Url ) {
    $scope.slasHostname = $sce.trustAsResourceUrl( config2Url + '/#/configuration/slas?alpha' );
  }
] );