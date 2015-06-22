'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig',
  function ($scope, Queue, Session, $stateParams, queueTableConfig) {
    $scope.Session = Session;

    $scope.redirectToInvites();

    $scope.fetch = function(){
      $scope.queues = Queue.query({tenantId : Session.tenant.tenantId}, function(){
        if ($scope.queues[0]){
          $scope.selectedQueue = $scope.queues[0];
        }
      });
    };

    $scope.$on('on:click:create', function(){
      $scope.selectedQueue = new Queue({
        tenantId: Session.tenant.tenantId
      });
    });

    $scope.$watch('Session.tenant.tenantId', $scope.fetch, true);

    $scope.tableConfig = queueTableConfig;
    $scope.fetch();
  }]);
