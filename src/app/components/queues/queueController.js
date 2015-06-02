'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'QueueService', 'Session', '$filter', '$routeParams', function ($scope, QueueService, Session, $filter, $routeParams) {
    $scope.queues = [];
    
    $scope.save = function () {
      return QueueService.save({tenantId : Session.tenantId}, $scope.queue).$promise
      .then(
          $scope.saveSuccess,
          $scope.saveFailure
        );
    };
    
    $scope.$on('$routeUpdate', function () {
      $scope.setQueue($routeParams.id);
    });
    
    $scope.setQueue = function (id) {
      var activeQueue = $filter('filter')($scope.queues, {id : id}, true)[0];
      $scope.queue = id ? activeQueue : {  } ;
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
      });
    };
    
    $scope.fetch();
  }]);
