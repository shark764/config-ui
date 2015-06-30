'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion',
  function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    Queue.prototype.postCreate = function (queue) {
      console.log('in post create');

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
