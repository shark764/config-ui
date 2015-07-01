'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', '$q', '$timeout',
  function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, $q, $timeout) {
    $scope.Session = Session;

    $scope.redirectToInvites();
  
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
