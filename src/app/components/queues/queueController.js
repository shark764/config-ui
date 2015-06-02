'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'QueueService', 'Session', '$filter', '$routeParams', function ($scope, QueueService, Session, $filter, $routeParams) {
    $scope.queues = [];
    $scope.queue = {};
    
    $scope.save = function () {
      if(!$scope.queue.id){
        return QueueService.save({tenantId : Session.tenantId}, $scope.queue).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
          );
      } else {
        return QueueService.update({ tenantId : Session.tenantId, id : $scope.queue.id}, { name : $scope.queue.name, description : $scope.queue.description}).$promise
          .then(
            $scope.saveSuccess,
            $scope.saveFailure
          );
      }
    };
    
    $scope.$on('$routeUpdate', function () {
      $scope.setQueue($routeParams.id);
    });
    
    $scope.setQueue = function(id) {
      if (id){
        QueueService.get({'tenantId' : Session.tenantId, 'id' : id}).$promise
        .then(function(data){
          $scope.queue = data.result;
        });
      } else {
        $scope.queue = {};
      }
    };
    
    $scope.saveSuccess = function () {
      $scope.queue = {};
      $scope.fetch();
    };

    $scope.saveFailure = function (reason) {
      $scope.error = reason.data;
    };

    $scope.fetch = function () {
      QueueService.query({tenantId : Session.tenantId}, function (data){
        $scope.queues = data.result;
        $scope.setQueue($routeParams.id);
      });
    };
    
    $scope.fetch();
  }]);
