'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'Alert', '$translate', '$timeout', 'loEvents',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, Alert, $translate, $timeout, loEvents) {
      var vm = this;
      vm.Session = Session;
      vm.tableConfig = queueTableConfig;
      vm.forms = {};
      vm.selectedQueueVersion = null;

      vm.fetchQueues = function () {
        return Queue.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.getDefaultVersion = function(){
        return new QueueVersion({
          query: '[{:after-seconds-in-queue 0 :query {}}]',
          tenantId: Session.tenant.tenantId,
          name: 'v1',
          maxPriority: 1000,
          minPriority: 1,
          priorityValue: 1,
          priorityRate: 10,
          priorityUnit: 'seconds'
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        vm.selectedQueueVersion = null;

        vm.initialVersion = vm.getDefaultVersion();

        vm.selectedQueue = new Queue({
          tenantId: Session.tenant.tenantId
        });
      });

      $scope.$on('details:panel:close', function () {
        vm.selectedQueueVersion = null;
      });

      vm.submit = function(){
        var isNew = vm.selectedQueue.isNew();

        return vm.selectedQueue.save(function(queue) {
          if (isNew) {
            vm.initialVersion.queueId = queue.id;
            vm.saveInitialVersion(vm.selectedQueue);
          }
        });

      };

      vm.updateVersions = function () {
        vm.versions = vm.fetchVersions();
      };

      vm.saveInitialVersion = function(queue){
        var qv = vm.initialVersion;

        vm.initialVersion.save()
          .then(function (versionResult) {
            queue.activeVersion = versionResult.version;
            queue.activeQueue = versionResult;
            queue.active = true;
            return queue.save();
          }, function(response) {
            Alert.error($translate.instant('queue.create.invalid.query'));

            if (angular.isDefined(response.data.error.attribute.query)) {
              vm.copySelectedVersion(qv);

              $timeout(function () {
                vm.forms.versionForm.query.$setValidity('api', false);

                vm.forms.versionForm.query.$error = {
                  api: response.data.error.attribute.query
                };

                vm.forms.versionForm.query.$setTouched();

                var unbindErrorWatch = $scope.$watch(function () {
                  return vm.forms.versionForm.query.$dirty;
                }, function(dirtyValue){
                  if (dirtyValue){
                    vm.forms.versionForm.query.$setValidity('api', true);
                    unbindErrorWatch();
                  }
                });
              });
            }

          }
        )
        .finally(vm.updateVersions);
      };

      vm.fetchVersions = function(){
        if (! vm.selectedQueue || vm.selectedQueue.isNew()){
          return [];
        } else {
          return QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: vm.selectedQueue.id
          }, 'QueueVersion' + vm.selectedQueue.id);
        }
      };

      vm.copySelectedVersion = function(version){
        vm.selectedQueueVersion = new QueueVersion({
          query: version.query,
          name: 'v' + (vm.fetchVersions().length + 1),
          tenantId: version.tenantId,
          queueId: version.queueId,
          minPriority: version.minPriority,
          maxPriority: version.maxPriority,
          priorityValue: version.priorityValue,
          priorityRate: version.priorityRate,
          priorityUnit: version.priorityUnit
        });
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

        for(var i = 0; i < vm.versions.length; i++){
          vm.versions[i].viewing = false;
          if (vm.versions[i].version === version.version){
            vm.versions[i].viewing = true;
          }
        }
      };


      $scope.$watch(function () {
        return vm.selectedQueue;
      }, function(newValue){

        // hack to fix partially removed selectedQueue cause by binding
        if(newValue && !(newValue instanceof Queue)) {
          vm.selectedQueue = null;
        }

        if (newValue && newValue instanceof Queue){
          vm.updateVersions();
          vm.selectedQueue.reset(); //TODO: figure out why this is needed
        }
      });

      $scope.$on('table:resource:selected', function () {
        vm.selectedQueueVersion = null;
      });

      vm.addQueueVersion = function () {
        vm.selectedQueueVersion = vm.getDefaultVersion();
        vm.selectedQueueVersion.queueId = vm.selectedQueue.id;
        vm.selectedQueueVersion.name= 'v' + (vm.fetchVersions().length + 1);
      };

      vm.saveVersion = function() {
        return vm.selectedQueueVersion.save().then(function(version){
          vm.selectedQueueVersion = null;
          return version;
        }).finally(vm.updateVersions);
      };
    }
  ]);
