'use strict';

angular.module('liveopsConfigPanel')
  .filter('invoke', ['$parse', function($parse) {
    return function(target, param) {
      if (angular.isFunction(target)) {
        return target.call(param);
      } else {
        return target;
      }
    };
  }]);
