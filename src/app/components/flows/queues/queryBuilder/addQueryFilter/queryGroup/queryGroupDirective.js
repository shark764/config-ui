'use strict';

angular.module('liveopsConfigPanel')
  .directive('queryGroup', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/flows/queues/queryBuilder/addQueryFilter/queryGroup/queryGroup.html',
      controller: 'queryGroupController as qgc',
      scope: {
        group: '=',
        query: '=ngModel',
        type: '@',
        level: '='
      }
    };
  });
