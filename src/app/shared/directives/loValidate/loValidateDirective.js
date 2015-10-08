'use strict';

angular.module('liveopsConfigPanel')
  .directive('loValidate', [function() {
    return {
      require: 'ngModel',
      link: function($scope, element, attrs, controller) {
        
        controller.$disabledValidators = {};
        controller.$disabledFormatters = {};
        
        $scope.$watch(attrs.loValidate, function(newValidate) {
          if (newValidate){
            enable();
          } else {
            disable();
          }
        }, true);
        
        function disable() {
          angular.extend(controller.$disabledValidators, controller.$validators);
          controller.$validators = {};
          
          angular.extend(controller.$disabledFormatters, controller.$formatters);
          controller.$formatters = {};
          
          for(var validator in controller.$disabledValidators) {
            controller.$setValidity(validator, true);
          }
        }
        
        function enable() {
          angular.extend(controller.$validators, controller.$disabledValidators);
          controller.$disabledValidators = {};
          
          angular.extend(controller.$formatters, controller.$disabledFormatters);
          controller.$disabledFormatters = {};
        }
      }
    };
   }]);
