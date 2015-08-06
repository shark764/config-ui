'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'BulkAction',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, BulkAction) {
      $scope.Session = Session;

      $scope.redirectToInvites();

      Queue.prototype.postCreate = function (queue) {
        var qv = new QueueVersion({
          tenantId: Session.tenant.tenantId,
          query: $scope.additional.initialQuery,
          name: 'v1',
          queueId: queue.id
        });

        return qv.save()
          .then(function (versionResult) {
            queue.activeVersion = versionResult.version;
            return queue.save();
          });
      };

      $scope.fetchQueues = function () {
        return Queue.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      $scope.$on('table:on:click:create', function () {
        $scope.showBulkActions = false;
        $scope.additional.initialQuery = '{}';

        $scope.selectedQueue = new Queue({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on('resource:details:queue:canceled', function () {
        if ($scope.selectedQueue.isNew()) {
          $scope.additional.initialQuery = '{}';
        }
      });

      $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

      $scope.tableConfig = queueTableConfig;

      $scope.additional = {
        initialQuery: '{}'
      };

      $scope.$on('table:resource:selected', function () {
        $scope.showBulkActions = false;
      });

      $scope.$on('table:on:click:actions', function () {
        $scope.showBulkActions = true;
      });

      $scope.bulkActions = {
        setQueueStatus: new BulkAction()
      };
    }
  ]);