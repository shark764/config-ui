'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'BulkAction', 'Chain',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, BulkAction, Chain) {
      $scope.Session = Session;

      //Create default first queue version
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
        initialQuery: '{}',
        copySelectedVersion: $scope.copySelectedVersion
      };

      $scope.bulkActions = {
        setQueueStatus: new BulkAction()
      };
      
      $scope.$on('create:queue:version', function () {
        $scope.selectedQueueVersion = new QueueVersion({
          queueId: $scope.selectedQueue.id,
          tenantId: Session.tenant.tenantId,
          name: 'v' + ($scope.fetchVersions().length + 1)
        });
      });
      
      $scope.$on('copy:queue:version', function (event, version) {
        $scope.copySelectedVersion(version);
      });
      
      $scope.$on('table:resource:selected', function () {
        $scope.selectedQueueVersion = null;
      });
      
      var versionSaveChain = Chain.get('version:save');
      
      versionSaveChain.hook('save', function() {
        return $scope.selectedQueueVersion.save();
      });
      
      $scope.fetchVersions = function(){
        if (! $scope.selectedQueue){
          return [];
        } else {
          return QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: $scope.selectedQueue.id
          }, 'QueueVersion' + $scope.selectedQueue.id);
        }
      };
      
      $scope.copySelectedVersion = function(version){
        $scope.selectedQueueVersion = new QueueVersion({
          query: version.query,
          name: 'v' + ($scope.fetchVersions().length + 1),
          tenantId: version.tenantId,
          queueId: version.queueId,
          minPriority: version.minPriority,
          maxPriority: version.maxPriority,
          priorityValue: version.priorityValue,
          priorityRate: version.priorityRate,
          priorityUnit: version.priorityUnit
        });
      };
    }
  ]);