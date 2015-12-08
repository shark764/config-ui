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
    }
  ]);
