"use strict";

angular.module('liveopsConfigPanel')
  .directive('compiledInclude', [
    '$templateCache',
    function($templateCache) {
      return {
        restrict: 'A',
        priority: 400,
        compile: function(element, attrs){
          var templateName = attrs.compiledInclude;
          var template = $templateCache.get(templateName);
          element.html(template);
        }
      };
    }
  ]);