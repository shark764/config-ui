'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'Alert', '$translate', '$timeout',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, Alert, $translate, $timeout) {
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
          query: '{}',
          tenantId: Session.tenant.tenantId,
          name: 'v1',
          maxPriority: 1000,
          minPriority: 1,
          priorityValue: 1,
          priorityRate: 10,
          priorityUnit: 'seconds'
        });
      };

      $scope.$on('table:on:click:create', function () {
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
        var createInitialVersion = vm.selectedQueue.isNew();

        return vm.selectedQueue.save(function(queue){
          if (createInitialVersion){
            vm.initialVersion.queueId = queue.id;
            vm.saveInitialVersion(queue);
          }
        });
      };

      vm.saveInitialVersion = function(queue){
        var qv = vm.initialVersion;

        vm.initialVersion.save()
          .then(function (versionResult) {
            queue.activeVersion = versionResult.version;
            queue.activeQueue = versionResult;
            queue.save();
          }, function(response){
            Alert.error($translate.instant('queue.create.invalid.query'));

            if (angular.isDefined(response.data.error.attribute.query)){
              vm.copySelectedVersion(qv);

              $scope.forms.versionForm.query.$setValidity('api', false);

              $scope.forms.versionForm.query.$error = {
                api: response.data.error.attribute.query
              };

              var unbindErrorWatch = $scope.$watch('forms.versionForm.query.$dirty', function(dirtyValue){
                if (dirtyValue){
                  $scope.forms.versionForm.query.$setValidity('api', true);
                  unbindErrorWatch();
                }
              });

              //Must use timeout here instead of evalAsync; evalAsync executes too early
              $timeout(function(){
                $scope.forms.versionForm.query.$setTouched();
              });
            }
          }
        );
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

      $scope.$on('table:resource:selected', function () {
        vm.selectedQueueVersion = null;
      });

      $scope.$on('create:queue:version', function () {
        vm.selectedQueueVersion = vm.getDefaultVersion();
        vm.selectedQueueVersion.queueId = vm.selectedQueue.id;
        vm.selectedQueueVersion.name= 'v' + (vm.fetchVersions().length + 1);
      });

      $scope.$on('copy:queue:version', function (event, version) {
        vm.copySelectedVersion(version);
      });

      vm.saveVersion = function() {
        return vm.selectedQueueVersion.save().then(function(version){
          vm.selectedQueueVersion = null;
          return version;
        });
      };
    }
  ]);
