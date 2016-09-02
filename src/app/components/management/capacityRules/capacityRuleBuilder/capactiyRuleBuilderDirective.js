'use strict';

angular.module('liveopsConfigPanel')
  .directive('capacityRuleBuilder', [function() {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        quantifier: '=',
      },
      templateUrl: 'app/components/management/capacityRules/capacityRuleBuilder/capacityRuleBuilder.html',
      controller: 'CapacityRuleBuilderController',
      link: function(scope, element, attrs, controller){
        //Verify that the rule count values are all integers
        //Set model to invalid if not
        scope.$watch('rules', function(rules){
          var isValid = true;
          rules.forEach(function(rule){
            console.log(rule.count);
            if(!Number.isInteger(rule.count)){
              isValid = false;
            }
          });

          controller.$setValidity('ruleSet', isValid);
        }, true);

      }
    };
  }]);
