'use strict';

angular.module('liveopsConfigPanel')
  .directive('versionPriority', [function () {
    return {
      scope: {
        queueVersion: '=',
        ngDisabled: "=",
        form: "="
      },
      templateUrl: 'app/components/flows/queues/versions/versionPriority.html'
    };
  }]);
