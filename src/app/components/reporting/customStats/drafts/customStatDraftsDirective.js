'use strict';

angular.module('liveopsConfigPanel')
  .directive('customStatDrafts', [function() {
    return {
      scope: {
        customStat: '=',
        drafts: '='
      },
      templateUrl: 'app/components/customStats/customStatManagement/drafts/customStatDrafts.html',
      controller: 'FlowDraftsController'
    };
  }]);
