'use strict';

angular.module('liveopsConfigPanel')
  .directive('afterSecondsInQueue', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/flows/queues/queryBuilder/afterSecondsInQueue/afterSecondsInQueue.html',
      controller: 'afterSecondsInQueueController as asiqc',
      scope: {
        level: '=',
        query: '=ngModel'
      }
    };
  });
