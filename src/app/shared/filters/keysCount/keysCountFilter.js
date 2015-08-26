'use strict';

angular.module('liveopsConfigPanel')
  .filter('keysCount', [function () {
    return function (obj) {
      return Object.keys(obj).length;
    };
  }]);