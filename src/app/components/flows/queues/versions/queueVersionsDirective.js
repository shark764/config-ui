'use strict';

angular.module('liveopsConfigPanel')
  .directive('queueVersions', [function () {
    return {
      scope: {
        queue: '='
      },
      templateUrl: 'app/components/flows/queues/versions/queueVersions.html',
      controller: 'QueueVersionsController as qvc'
    };
  }]);
