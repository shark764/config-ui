'use strict';

angular.module('liveopsConfigPanel')
  .directive('flowDrafts', [function () {
    return {
      scope: {
        flow: '=',
        drafts: '=',
        versions: '='
      },
      templateUrl: 'app/components/flows/flowManagement/drafts/flowDrafts.html',
      controller: 'FlowDraftsController'
    };
  }]);