'use strict';

angular.module('liveopsConfigPanel')
  .directive('customStatVersions', [function() {
    return {
      scope: {
        customStat: '=',
        onEditClick: '&'
      },
      templateUrl: 'app/components/reporting/customStats/versions/customStatVersions.html',
      controller: 'CustomStatVersionsController'
    };
  }]);
