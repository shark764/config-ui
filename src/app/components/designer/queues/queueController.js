'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig',
  function ($scope, Queue, Session, $stateParams, queueTableConfig) {
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

    $scope.$on('created:resource:tenants:' + Session.tenant.id + ':queues', function(event, resource){
      $scope.queues.push(resource);
      $scope.selectedQueue = resource;
    })

    $scope.fetch();
    $scope.tableConfig = queueTableConfig;
  }]);
