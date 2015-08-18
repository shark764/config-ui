'use strict';

angular.module('liveopsConfigPanel')
  .filter('invoke', [function() {
    return function(target, param) {
      if (angular.isFunction(target)) {
        return target.call(param);
      } else {
        return target;
      }
    };
  }]);
