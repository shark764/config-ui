'use strict';

angular.module('liveopsConfigPanel')
  .directive('capacityRuleBuilder', [function() {
    return {
      scope: {
        ngModel: '=',
      },
      templateUrl: 'app/components/management/capacityRules/capacityRuleBuilder/capacityRuleBuilder.html',
      controller: 'CapacityRuleBuilderController'
    };
  }]);
