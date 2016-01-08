'use strict';

//TODO: add to config-shared
angular.module('liveopsConfigPanel')
  .filter('trusted', ['$sce', function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);