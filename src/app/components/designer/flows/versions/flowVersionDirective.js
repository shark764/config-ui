'use strict';

angular.module('liveopsConfigPanel')
  .directive('flowVersions', [function () {
    return {
      scope: {
        flow: '=',
        versions: '='
      },
      templateUrl: 'app/components/designer/flows/versions/flowVersions.html',
      controller: 'FlowVersionsController'
    };
  }]);