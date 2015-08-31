'use strict';

angular.module('liveopsConfigPanel')
.controller('QueueQueryCreatorController', ['$scope', 'Session', 'QueueVersion',

  ])
.directive('queueCreator', [function () {
  return {
    scope: {
      queue: '='
    },
    templateUrl: 'app/components/flows/queues/queueQueryCreator/queueQueryCreator.html',
    controller: 'QueueQueryCreatorController'
  };
}]);
