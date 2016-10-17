'use strict';

angular.module('liveopsConfigPanel')
  .filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  });
