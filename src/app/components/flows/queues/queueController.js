'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', '$q',
  function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, $q) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    this.postCreate = function (queue) {

      var queue = queue;

      var iqv = new QueueVersion({
        tenantId: Session.tenant.tenantId,
        query: $scope.additional.initialQuery,
        name: 'v1',
        queueId: queue.id
      });

      var promise = iqv.save().then(function (versionResult) {
        queue.activeVersion = versionResult.version;
        return queue.save();
      });

      return promise;
    };

    this.postSave = function (queue) {
      var d = $q.defer();
      d.resolve(queue);
      return d.promise;
    };

    Queue.prototype.postCreate = this.postCreate;

    Queue.prototype.postSave = this.postSave;

    $scope.fetch = function(){
      $scope.queues = Queue.query({
        tenantId : Session.tenant.tenantId
      });
    };

    $scope.$on('on:click:create', function() {
      $scope.additional.initialQuery = '';

      $scope.selectedQueue = new Queue({
        tenantId: Session.tenant.tenantId
      });
    });

    $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

    $scope.tableConfig = queueTableConfig;

    $scope.additional = {
      initialQuery: ''
    };

    $scope.fetch();
  }]);
