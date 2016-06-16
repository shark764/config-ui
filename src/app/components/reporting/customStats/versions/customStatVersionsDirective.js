'use strict';

angular.module('liveopsConfigPanel')
  .directive('customStatVersions', [function() {
    return {
      scope: {
        stat: '=',
        onEditClick: '&'
      },
      templateUrl: 'app/components/reporting/customStats/versions/customStatVersions.html',
      controller: 'CustomStatVersionsController'
    };
  }]);
