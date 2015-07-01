'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', '$q', '$timeout',
  function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, $q, $timeout) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    Queue.prototype.postCreate = function (queue) {
      var qv =new QueueVersion({
        tenantId: Session.tenant.tenantId,
        query: $scope.additional.initialQuery,
        name: 'v1',
        queueId: queue.id
      })

      return qv.save()
        .then(function (versionResult) {
          queue.activeVersion = versionResult.version;
          return queue.save();
        });
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

    window.qs = $scope;
  }]);
