'use strict';

angular.module('liveopsConfigPanel')
.directive('readonlyQueueQuery', [function () {
  return {
    restrict: 'E',
    scope: {
      queue: '=',
      version: '='
    },
    templateUrl: 'app/components/flows/queues/queueQueryCreator/readonlyQueueQuery.html',
    controller: 'ReadonlyQueueQueryController'
  };
}]);
