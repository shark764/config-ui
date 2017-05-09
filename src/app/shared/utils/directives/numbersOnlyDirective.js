'use strict';

angular.module('liveopsConfigPanel')
  .directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
          function fromUser(text) {
            var transformedInput;
            if (text) {
              try {
                transformedInput = text.replace(/[^0-9]|\s/g, '');

                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
              } catch(err) {
                transformedInput = '';
              }
            }
            return transformedInput;
          }
          ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
