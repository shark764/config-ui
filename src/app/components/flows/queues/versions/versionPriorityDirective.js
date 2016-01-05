'use strict';

angular.module('liveopsConfigPanel')
  .directive('versionPriority', ['versionPriorityUnits', function(versionPriorityUnits) {
    return {
      scope: {
        queueVersion: '=',
        ngDisabled: '='
      },
      templateUrl: 'app/components/flows/queues/versions/versionPriority.html',
      link: function($scope) {
        $scope.versionPriorityUnits = versionPriorityUnits;
      }
    };
  }]);
