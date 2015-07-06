'use strict';

angular.module('liveopsConfigPanel')
  .directive('flowVersions', [function () {
    return {
      scope: {
        flow: '=',
        versions: '='
      },
      templateUrl: 'app/components/flows/flowManagement/versions/flowVersions.html',
      controller: 'FlowVersionsController'
    };
  }]);