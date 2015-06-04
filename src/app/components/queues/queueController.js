'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$filter', '$routeParams', function ($scope, Queue, Session, $filter, $routeParams) {
    $scope.queues = [];
    $scope.queue = {};

    $scope.fetch = function () {
      $scope.queues = Queue.query({tenantId : Session.tenantId});
      $scope.setQueue($routeParams.id);
    };

    $scope.setQueue = function(id) {
      if (id){
        $scope.queue = Queue.get({'tenantId' : Session.tenantId, 'id' : id});
      } else {
        $scope.queue = new Queue();
      }
    };

    $scope.fetch();

    $scope.$on('$routeUpdate', function () {
      $scope.setQueue($routeParams.id);
    });

    $scope.saveSuccess = function () {
      $scope.queue = {};
      $scope.fetch();
    };

    $scope.saveFailure = function (reason) {
      $scope.error = reason.data;
    };

    $scope.save = function () {
      $scope.queue.save({tenantId: Session.tenantId, id: $scope.queue.id}, $scope.saveSuccess, $scope.saveFailure);
    };
  }]);
