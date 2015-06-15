angular.module('liveopsConfigPanel')
  .directive('jsonText', function(){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl){
        function into (input){
          ctrl.$setValidity('json', true);

          try {
            return JSON.parse(input);
          }
          catch (err){
            ctrl.$setValidity('json', false);
          }

          return {};
        }
        function out(data) {
          ctrl.$setValidity('json', true);

          try {
            return JSON.stringify(data);
          }
          catch (err){
            ctrl.$setValidity('json', false);
          }

          return '';
        }

        ctrl.$parsers.push(into);
        ctrl.$formatters.push(out);
      }
    }
  });