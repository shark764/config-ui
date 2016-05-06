'use strict';

angular.module('liveopsConfigPanel')
  .directive('addQueryFilter', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/flows/queues/queryBuilder/addQueryFilter/addQueryFilter.html',
      controller: 'addQueryFilterController as aqfc',
      scope: {
        level: '=',
        query: '=ngModel'
      }
    };
  });
