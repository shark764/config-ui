angular.module('liveopsConfigPanel')
  .directive('jsonText', function(){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModel){
        function into (input){
          return JSON.parse(input);
        }
        function out(data) {
          return JSON.stringify(data);
        }

        ngModel.$parsers.push(into);
        ngModel.$formatters.push(out);
      }
    }
  });