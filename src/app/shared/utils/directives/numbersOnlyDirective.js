'use strict';

angular.module('liveopsConfigPanel')
.directive('numbersOnly', function() {
  return function(scope, element, attrs) {
    var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    element.bind('keyup keydown', function(event) {
      var inputVal = element[0].value;
      var startsWithZero = inputVal.match(/^0+/);

      if ($.inArray(event.which, keyCode) === -1) {
        scope.$apply(function() {
          scope.$eval(attrs.numbersOnly);
          event.preventDefault();
        });
        event.preventDefault();
      } else {
        // breaking this into its own condition due to some browser quirk that won't
        // allow the 0 to be suppressed
        if (startsWithZero !== null) {
          element[0].value = '';
        }
      }
    });
  };

});
