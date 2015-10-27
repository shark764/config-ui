'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', '$state', 'Session', 'QueueVersion',
    function ($scope, $state, Session, QueueVersion) {
      var self = this;

      $scope.fetchVersions = function () {
        if ($scope.queue && $scope.queue.id) {
          return QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: $scope.queue.id
          }, 'QueueVersion' + $scope.queue.id);
        } else {
          return [];
        }
      };

      $scope.toggleDetails = function (version) {
        if (! version){
          return;
        }
        
        if (version.viewing){
          version.viewing = false;
        } else {
          self.showDetails(version);
        }
      };
      
      this.showDetails = function(version){
        if (! version){
          return;
        }
        
        for(var i = 0; i < $scope.fetchVersions().length; i++){
          $scope.fetchVersions()[i].viewing = false;
          if ($scope.fetchVersions()[i].version === version.version){
            $scope.fetchVersions()[i].viewing = true;
          }
        }
      };
      
      $scope.addQueueVersion = function(){
        $scope.$emit('create:queue:version');
      };
      
      $scope.createVersionCopy = function(version) {
        $scope.$emit('copy:queue:version', version);
      };
      
      $scope.$watch('queue', function(){
        if ($scope.queue){
          $scope.fetchVersions().$promise.then(function(){
            self.showDetails($scope.queue.activeQueue);
          });
        }
      });
    }
  ]);