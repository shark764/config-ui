'use strict';

angular.module('liveopsConfigPanel')
  .directive('flowDrafts', [function () {
    return {
      scope: {
        flow: '=',
        drafts: '='
      },
      templateUrl: 'app/components/flows/flowManagement/drafts/flowDrafts.html',
      controller: 'FlowDraftsController'
    };
  }]);