'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'BulkAction',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, BulkAction) {
      $scope.Session = Session;

      Queue.prototype.postCreate = function (queue) {
        var qv = $scope.additional.initialVersion;
        qv.queueId = queue.id;
        return qv.save()
          .then(function (versionResult) {
            queue.activeVersion = versionResult.version;
            queue.activeQueue = versionResult;
            return queue.save();
          });
      };

      $scope.fetchQueues = function () {
        return Queue.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.getDefaultVersion = function(){
        return new QueueVersion({
          query: '{}',
          tenantId: Session.tenant.tenantId,
          name: 'v1',
          maxPriority: 1000,
          minPriority: 1,
          priorityValue: 1,
          priorityRate: 10,
          priorityUnit: 'seconds'
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.additional.initialVersion = $scope.getDefaultVersion();

        $scope.selectedQueue = new Queue({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on('resource:details:queue:canceled', function () {
        if ($scope.selectedQueue.isNew()) {
          $scope.additional.initialVersion = $scope.getDefaultVersion();
        }
      });

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.tableConfig = queueTableConfig;

      $scope.additional = {
        initialVersion: $scope.getDefaultVersion()
      };

      $scope.bulkActions = {
        setQueueStatus: new BulkAction()
      };
    }
  ]);