'use strict';

angular.module('liveopsConfigPanel')
  .directive('queueQueryCreator', [function () {
    return {
      restrict: 'E',
      scope: {
        queue: '=',
        version: '='
      },
      templateUrl: 'app/components/flows/queues/queueQueryCreator/queueQueryCreator.html',
      controller: 'QueueQueryCreatorController'
    };
  }]);