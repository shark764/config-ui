'use strict';

angular.module('liveopsConfigPanel')
.directive('activeVersion', ['QueueVersion', function (QueueVersion) {
  return {
    restrict: 'E',
    scope: {
      queue: '='
    },
    template: '{{queueActiveVersion}}',
    link: function ($scope) {
      $scope.$watch('queue.activeVersion', function () {
        QueueVersion.get({ id: $scope.queue.activeVersion, queueId : $scope.queue.id, tenantId: $scope.queue.tenantId}, function(data){
          $scope.queueActiveVersion = data.name;
        });
      });
    }
  };
}]);
