'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueVersionsController', ['$scope', '$state', 'Session', 'QueueVersion',
    function ($scope, $state, Session, QueueVersion) {
      var vm = this;

      vm.fetchVersions = function(){
        if (! vm.queue || vm.queue.isNew()){
          return [];
        } else {
          return QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: vm.queue.id
          }, 'QueueVersion' + vm.queue.id);
        }
      };

      vm.toggleDetails = function (version) {
        if (! version){
          return;
        }

        if (version.viewing){
          version.viewing = false;
        } else {
          vm.showDetails(version);
        }
      };

      vm.showDetails = function(version){
        if (! version){
          return;
        }

        vm.versions = vm.fetchVersions();

        for(var i = 0; i < vm.versions.length; i++){
          vm.versions[i].viewing = false;
          if (vm.versions[i].version === version.version){
            vm.versions[i].viewing = true;
          }
        }
      };

      vm.addQueueVersion = function(){
        $scope.$emit('create:queue:version');
      };

      vm.createVersionCopy = function(version) {
        $scope.$emit('copy:queue:version', version);
      };

      $scope.$watch('queue', function(){
        if ($scope.queue){
          vm.queue = $scope.queue;
          vm.versions = vm.fetchVersions();
          vm.showDetails(vm.queue.activeQueue);
        }
      });
    }
  ]);
