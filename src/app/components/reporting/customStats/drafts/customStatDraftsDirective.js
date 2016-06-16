'use strict';

angular.module('liveopsConfigPanel')
  .directive('customStatDrafts', [function() {
    return {
      scope: {
        stat: '=',
        drafts: '='
      },
      templateUrl: 'app/components/reporting/customStats/drafts/customStatDrafts.html',
      controller: 'CustomStatDraftsController'
    };
  }]);
