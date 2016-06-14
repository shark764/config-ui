'use strict';

angular.module('liveopsConfigPanel')
  .directive('customStatDrafts', [function() {
    return {
      scope: {
        customStat: '=',
        drafts: '='
      },
      templateUrl: 'app/components/reporting/customStats/drafts/customStatDrafts.html',
      controller: 'CustomStatDraftsController'
    };
  }]);
