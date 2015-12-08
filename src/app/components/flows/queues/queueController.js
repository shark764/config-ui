'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$scope', 'Queue', 'Session', '$stateParams', 'queueTableConfig', 'QueueVersion', 'Alert', '$translate', '$timeout', 'loEvents',
    function ($scope, Queue, Session, $stateParams, queueTableConfig, QueueVersion, Alert, $translate, $timeout, loEvents) {
      var vm = this;
      $scope.Session = Session;
      $scope.tableConfig = queueTableConfig;
      $scope.forms = {};
      
      $scope.fetchQueues = function () {
        return Queue.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };
      
      $scope.getDefaultVersion = function(){
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

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        $scope.selectedQueueVersion = null;
        
        $scope.initialVersion = $scope.getDefaultVersion();

        $scope.selectedQueue = new Queue({
          tenantId: Session.tenant.tenantId
        });
      });
      
      $scope.$on('details:panel:close', function () {
        $scope.selectedQueueVersion = null;
      });
      
      $scope.submit = function(){
        var createInitialVersion = $scope.selectedQueue.isNew();
        return $scope.selectedQueue.save(function(queue){
          if (createInitialVersion){
            $scope.initialVersion.queueId = queue.id;
            vm.saveInitialVersion(queue);
          }
        });
      };
      
      vm.saveInitialVersion = function(queue){
        var qv = $scope.initialVersion;
        
        $scope.initialVersion.save()
          .then(function (versionResult) {
            queue.activeVersion = versionResult.version;
            queue.activeQueue = versionResult;
            queue.active = true;
            queue.save();
          }, function(response){
            Alert.error($translate.instant('queue.create.invalid.query'));
            
            if (angular.isDefined(response.data.error.attribute.query)){
              $scope.copySelectedVersion(qv);
              $scope.queryType = 'advanced';
              
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
      
      $scope.fetchVersions = function(){
        if (! $scope.selectedQueue || $scope.selectedQueue.isNew()){
          return [];
        } else {
          return QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: $scope.selectedQueue.id
          }, 'QueueVersion' + $scope.selectedQueue.id);
        }
      };
      
      $scope.copySelectedVersion = function(version){
        $scope.selectedQueueVersion = new QueueVersion({
          query: version.query,
          name: 'v' + ($scope.fetchVersions().length + 1),
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
        $scope.selectedQueueVersion = null;
      });
      
      $scope.$on('create:queue:version', function () {
        $scope.selectedQueueVersion = $scope.getDefaultVersion();
        $scope.selectedQueueVersion.queueId= $scope.selectedQueue.id;
        $scope.selectedQueueVersion.name= 'v' + ($scope.fetchVersions().length + 1);
      });
      
      $scope.$on('copy:queue:version', function (event, version) {
        $scope.copySelectedVersion(version);
      });
      
      $scope.saveVersion = function() {
        return $scope.selectedQueueVersion.save().then(function(version){
          $scope.selectedQueueVersion = null;
          return version;
        });
      };
    }
  ]);
