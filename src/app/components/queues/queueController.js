'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$routeParams', 'flowSidebarConfig', 'queueTableConfig',
  function ($scope, Queue, Session, $routeParams, flowSidebarConfig, queueTableConfig) {
    $scope.Session = Session;
    
    $scope.fetch = function(){
      $scope.queues = Queue.query({tenantId : Session.tenant.id}, function(){
        if ($scope.queues[0]){
          $scope.selectedQueue = $scope.queues[0];
        }
      });
    }
    
    $scope.createQueue = function(){
      $scope.selectedQueue = new Queue({
        tenantId: Session.tenant.id
      });
    }

    $scope.$watch('Session.tenant.id', function () {
      $scope.fetch();
    });
    
    $scope.fetch();
    $scope.sidebarConfig = flowSidebarConfig;
    $scope.tableConfig = queueTableConfig;
  }]);
