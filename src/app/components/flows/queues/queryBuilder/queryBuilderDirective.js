'use strict';

angular.module('liveopsConfigPanel')
  .directive('queryBuilder', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/flows/queues/queryBuilder/queryBuilder.html',
      controller: 'queryBuilderController as qbc',
      scope: {}
    };
  });
