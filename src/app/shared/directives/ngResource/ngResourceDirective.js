'use strict';

angular.module('liveopsConfigPanel')
  .directive('ngResource', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      controller: function() {
      }
    };
  }]);