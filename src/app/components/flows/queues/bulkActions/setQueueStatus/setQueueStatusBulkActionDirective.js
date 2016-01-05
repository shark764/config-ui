'use strict';

angular.module('liveopsConfigPanel')
  .directive('baSetQueueStatus', ['Queue', 'Session', 'BulkAction', 'statuses',
    function (Queue, Session, BulkAction, statuses) {
      return {
        restrict: 'E',
        scope: {},
        require: '?^bulkActionExecutor',
        templateUrl: 'app/components/flows/queues/bulkActions/setQueueStatus/setQueueStatusBulkAction.html',
        link: function ($scope, elem, attr, bulkActionExecutor) {
          $scope.bulkAction = new BulkAction();

          if(bulkActionExecutor){
            bulkActionExecutor.register($scope.bulkAction);
          }
          
          $scope.$evalAsync(function() {
            $scope.statuses = statuses();
          });
          
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
            $scope.active = '';
          };
        }
      };
    }
  ]);
