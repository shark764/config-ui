'use strict';

angular.module('liveopsConfigPanel')
  .filter('parse', ['$parse', function($parse) {
    return function(target, param) {
      return $parse(param)(target);
    };
  }]);
