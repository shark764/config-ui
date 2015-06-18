'use strict';

angular.module('liveopsConfigPanel')
.directive('highlightOnClick', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs, $window) {
      console.log('asdf');
      element.on('click', function () {
              console.log('asdffff');

        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length);
        }
      });
    }
  };
});