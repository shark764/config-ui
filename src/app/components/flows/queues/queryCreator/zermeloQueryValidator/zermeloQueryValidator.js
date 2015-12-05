(function() {
  'use strict';

  angular.module('liveopsConfigPanel')
    .directive('zermeloQueryValidator', ZermeloQueryValidator);

    function ZermeloQueryValidator(ZermeloQuery, jsedn) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attr, ctrl) {

          function validateZermelo(input) {
            ctrl.$setValidity('zermelo', false);

            try {
              if(ZermeloQuery.fromEdn(jsedn.parse(input))) {
                ctrl.$setValidity('zermelo', true);
              }
            } catch (e) {}

            return input;
          }

          ctrl.$parsers.unshift(validateZermelo);
          ctrl.$formatters.unshift(validateZermelo);
        }
      };
    }

})();
