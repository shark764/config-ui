'use strict';

angular.module('liveopsConfigPanel')
  .directive('flowVersions', [function () {
    return {
      scope: {
        flow: '=',
        onEditClick: '&'
      },
      templateUrl: 'app/components/flows/flowManagement/versions/flowVersions.html',
      controller: 'FlowVersionsController'
    };
  }]);
