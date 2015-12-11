'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'Alert', '$translate', '$timeout', 'loEvents', 'moment',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, Alert, $translate, $timeout, loEvents, moment) {
      var vm = this;
      vm.Session = Session;
      vm.tableConfig = queueTableConfig;
      vm.forms = {};
      vm.selectedQueueVersion = null;
      vm.moment = moment;

      vm.fetchQueues = function () {
        return Queue.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.getDefaultVersion = function(){
        return new QueueVersion({
          query: '({:after-seconds-in-queue 0})',
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
      }, vm.updateVersions);

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
