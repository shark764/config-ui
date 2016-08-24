'use strict';

angular.module('liveopsConfigPanel')
  .controller('QueueController', ['$rootScope', '$scope', 'Queue', 'Session', 'queueTableConfig', 'QueueVersion', 'Alert', 'Modal', '$translate', 'loEvents', 'ZermeloService',
    function($rootScope, $scope, Queue, Session, queueTableConfig, QueueVersion, Alert, Modal, $translate, loEvents, ZermeloService) {
      var vm = this;
      vm.Session = Session;
      vm.tableConfig = queueTableConfig;
      vm.forms = {};
      vm.selectedQueueVersion = null;

      // Specifies that we are using Zermelo v2
      var VERSION_NUM = 2;

      $scope.showBasicQuery = true;

      vm.fetchQueues = function() {
        return Queue.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.getDefaultVersion = function() {
        return new QueueVersion({
          query: ZermeloService.getQueryString(),
          tenantId: Session.tenant.tenantId,
          name: 'v1',
          maxPriority: 1000,
          minPriority: 1,
          priorityValue: 1,
          priorityRate: 10,
          priorityUnit: 'seconds',
          queryVersion: VERSION_NUM
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        vm.selectedQueueVersion = null;

        $rootScope.$emit('queue.query.reset');

        vm.initialVersion = vm.getDefaultVersion();

        vm.selectedQueue = new Queue({
          tenantId: Session.tenant.tenantId
        });
      });

      $rootScope.$on(loEvents.bulkActions.close, vm.confirmCancel);

      vm.confirmCancel = function() {
        if (vm.forms.detailsForm.$dirty) {
          return Modal.showConfirm(
            {
              message: $translate.instant('unsavedchanges.nav.warning'),
              okCallback: vm.reset
            }
          );
        } else {
          vm.reset();
        }
      };

      vm.reset = function() {
        $rootScope.$emit('queue.query.reset');
        vm.selectedQueueVersion = null;
        vm.selectedQueue = null;
      };

      vm.submit = function() {
        var isNew = vm.selectedQueue.isNew();

        return vm.selectedQueue.save(function(queue) {
          vm.forms.detailsForm.$setUntouched();
          vm.forms.detailsForm.$setPristine();
          vm.forms.versionForm.$setUntouched();
          vm.forms.versionForm.$setPristine();
          if (isNew) {
            vm.initialVersion.queueId = queue.id;
            vm.saveInitialVersion(vm.selectedQueue);
          }
        });

      };

      vm.updateVersions = function() {
        vm.versions = vm.fetchVersions();
      };

      vm.saveInitialVersion = function(queue) {
        var qv = vm.initialVersion;
        qv.query = ZermeloService.getQueryString();

        vm.initialVersion.save()
          .then(function(versionResult) {
            $rootScope.$emit('queue.query.reset');
            queue.activeVersion = versionResult.version;
            queue.activeQueue = versionResult;
            queue.active = true;
            return queue.save();
          }, function(response) {
            Alert.error($translate.instant('queue.create.invalid.query'));

            if (angular.isDefined(response.data.error.attribute.query)) {
              vm.copySelectedVersion(qv);

              $scope.$evalAsync(function() {
                vm.forms.versionForm.query.$setValidity('api', false);

                vm.forms.versionForm.query.$error = {
                  api: response.data.error.attribute.query
                };

                vm.forms.versionForm.query.$setTouched();

                var unbindErrorWatch = $scope.$watch(function() {
                  return vm.forms.versionForm.query.$dirty;
                }, function(dirtyValue) {
                  if (dirtyValue) {
                    vm.forms.versionForm.query.$setValidity('api', true);
                    unbindErrorWatch();
                  }
                });
              });
            }

          })
          .finally(vm.updateVersions);
      };

      vm.fetchVersions = function() {
        if (!vm.selectedQueue || vm.selectedQueue.isNew()) {
          return [];
        } else {
          return QueueVersion.cachedQuery({
            tenantId: Session.tenant.tenantId,
            queueId: vm.selectedQueue.id
          }, 'QueueVersion' + vm.selectedQueue.id);
        }
      };

      vm.copySelectedVersion = function(version) {
        $rootScope.$emit('queue.query.reset');
        ZermeloService.parseString(version.query)
        vm.selectedQueueVersion = new QueueVersion({
          query: ZermeloService.getQueryString(),
          name: 'v' + (vm.fetchVersions().length + 1),
          tenantId: version.tenantId,
          queueId: version.queueId,
          minPriority: version.minPriority,
          maxPriority: version.maxPriority,
          priorityValue: version.priorityValue,
          priorityRate: version.priorityRate,
          priorityUnit: version.priorityUnit,
          queryVersion: VERSION_NUM
        });
        angular.element('#queue-version-panel').css('display', 'table-cell');
      };

      vm.toggleDetails = function(version) {
        if (!version) {
          return;
        }

        if (version.viewing) {
          version.viewing = false;
        } else {
          vm.showDetails(version);
        }
      };

      vm.showDetails = function(version) {
        if (!version) {
          return;
        }

        for (var i = 0; i < vm.versions.length; i++) {
          vm.versions[i].viewing = false;
          if (vm.versions[i].version === version.version) {
            vm.versions[i].viewing = true;
          }
        }
      };

      vm.updateActive = function(){
        var queueCopy = new Queue({
          id: vm.selectedQueue.id,
          tenantId: vm.selectedQueue.tenantId,
          active: ! vm.selectedQueue.active
        });

        return queueCopy.save(function(result){
          vm.selectedQueue.$original.active = result.active;
        });
      };

      $scope.$watch(function() {
        return vm.selectedQueue;
      }, function(newValue) {

        // hack to fix partially removed selectedQueue cause by binding
        if (newValue && !(newValue instanceof Queue)) {
          vm.selectedQueue = null;
        }

        if (newValue && newValue instanceof Queue) {
          vm.updateVersions();
          vm.selectedQueue.reset(); //TODO: figure out why this is needed
        }
      });

      $scope.$on(loEvents.tableControls.itemSelected, function() {
        vm.selectedQueueVersion = null;
      });

      vm.addQueueVersion = function() {
        $rootScope.$emit('queue.query.reset');
        vm.selectedQueueVersion = vm.getDefaultVersion();
        vm.selectedQueueVersion.queueId = vm.selectedQueue.id;
        vm.selectedQueueVersion.name = 'v' + (vm.fetchVersions().length + 1);
        angular.element('#queue-version-panel').css('display', 'table-cell');
      };

      vm.saveVersion = function() {
        vm.selectedQueueVersion.query = ZermeloService.getQueryString();
        return vm.selectedQueueVersion.save().then(function(version) {
          vm.selectedQueueVersion = null;
          $rootScope.$emit('queue.query.reset');
          return version;
        }).finally(vm.updateVersions);
      };
    }
  ]);
