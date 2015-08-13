'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetQueueStatus', ['Queue', 'Session',
    function (Queue, Session) {
      return {
        restrict: 'AE',
        scope: {
          bulkAction: '='
        },
        templateUrl: 'app/components/flows/queues/bulkActions/setQueueStatus/setQueueStatusBulkAction.html',
        link: function ($scope) {
          $scope.bulkAction.apply = function(queue) {
            var queueCopy = new Queue();
            queueCopy.id = queue.id;
            queueCopy.tenantId = Session.tenant.tenantId;
            queueCopy.active = $scope.active;
            return queueCopy.save().then(function(queueCopy) {
              angular.copy(queueCopy, queue);
              queue.checked = true;
              return queue;
            });
          };
          
          $scope.bulkAction.reset = function() {
            $scope.bulkAction.checked = false;
            $scope.active = false;
          };
        }
      };
    }
  ]);
