'use strict';

/**
  Taken from a stackoverflow.com post reply

  http://stackoverflow.com/a/25822878
**/

angular.module('liveopsConfigPanel')
  .directive('disableContents', [function() {
    return {
      compile: function(tElem, tAttrs) {
        var inputs = tElem.find('input, label');
        angular.forEach(inputs, function(el){
            el = angular.element(el);
            var prevVal = el.attr('ng-disabled');
            prevVal = prevVal ? prevVal +  ' || ': '';
            prevVal += tAttrs['disableContents'];
            el.attr('ng-disabled', prevVal);
        });
      }
    };
  }]);