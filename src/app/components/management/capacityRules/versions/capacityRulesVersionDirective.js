'use strict';

angular.module('liveopsConfigPanel')
  .directive('capacityRulesVersions', [function() {
    return {
      scope: {
        capacityRule: '=',
        getVersions: '&'
      },
      templateUrl: 'app/components/management/capacityRules/versions/capacityRulesVersion.html',
      controller: 'CapacityRulesVersionsController'
    };
  }]);
