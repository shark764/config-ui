'use strict';

angular.module('liveopsConfigPanel').controller('QueueController', [
  '$rootScope',
  '$scope',
  'Queue',
  'Tenant',
  'Session',
  'queueTableConfig',
  'QueueVersion',
  'Alert',
  'Modal',
  '$translate',
  'loEvents',
  'ZermeloService',
  '$q',
  '$http',
  'apiHostname',
  function(
    $rootScope,
    $scope,
    Queue,
    Tenant,
    Session,
    queueTableConfig,
    QueueVersion,
    Alert,
    Modal,
    $translate,
    loEvents,
    ZermeloService,
    $q,
    $http,
    apiHostname
  ) {
    var vm = this;
    vm.Session = Session;
    vm.tableConfig = queueTableConfig;
    vm.forms = {};
    vm.selectedQueueVersion = null;
    vm.slas = [];
    vm.sessionTenant = null;

    // Specifies that we are using Zermelo v1 or v2
    vm.VERSION_NUM = 2;

    $scope.showBasicQuery = true;

    vm.fetchQueues = function() {
      return Queue.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
    };

    vm.loadSlas = function() {
      // SDK function uses tenantId setted in the SDK session,
      // but this function to load SLAs is called sometimes before
      // the tenant is setted.
      // Session gets tenant active first, so we change to http service request
      $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + Session.tenant.tenantId + '/slas',
        headers: {
          Authorization: 'Token ' + Session.token
        }
      }).then(function(response) {
        var slas = _.sortBy(
          _.filter(response.data.result, function(sla) {
            return sla.active && sla.activeVersion;
          }),
          'name'
        );
        // Make sure that the tenant's default SLA is available to this user
        Tenant.cachedGet({
          id: Session.tenant.tenantId
        }).$promise.then(function(tenant) {
          vm.sessionTenant = tenant;
          var tenantDefaultSla = '';
          var selectedSla = _.find(slas, { id: tenant.defaultSlaId });
          if (selectedSla) {
            tenantDefaultSla = ': ' + selectedSla.name;
            // Use Tenant default SLA by default
            slas.unshift({
              id: 'default',
              name: $translate.instant('tenant.details.sla.tenantDefault') + tenantDefaultSla
            });
          }
          vm.slas = slas;
        });
        vm.slas = slas;
      });
    };

    vm.getDefaultVersion = function() {
      return new QueueVersion({
        query: ZermeloService.getQueryString(true),
        tenantId: Session.tenant.tenantId,
        name: 'v1',
        maxPriority: 1000,
        minPriority: 1,
        priorityValue: 1,
        priorityRate: 10,
        priorityUnit: 'seconds',
        queryVersion: vm.VERSION_NUM,
        slaId: 'default'
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
        return Modal.showConfirm({
          message: $translate.instant('unsavedchanges.nav.warning'),
          okCallback: vm.reset
        });
      } else {
        vm.reset();
      }
    };

    vm.reset = function() {
      $rootScope.$emit('queue.query.reset');
      vm.forms.detailsForm.$setUntouched();
      vm.forms.detailsForm.$setPristine();
      vm.forms.versionForm.$setUntouched();
      vm.forms.versionForm.$setPristine();
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
      if (!vm.selectedQueue.isNew()) {
        $q.when(vm.fetchVersions().$promise).then(function(versions) {
          for (var i = 0; i < versions.length; i++) {
            var selectedSla = _.find(vm.slas, { id: versions[i].slaId });
            if (selectedSla) {
              versions[i].slaName = selectedSla.name;
            }
          }
          vm.versions = versions;
        });
      }
    };

    vm.saveInitialVersion = function(queue) {
      var qv = vm.initialVersion;

      if (vm.initialVersion.slaId === 'default') {
        vm.initialVersion.slaId = vm.sessionTenant.defaultSlaId;
      }

      if (vm.VERSION_NUM === 2) {
        qv.query = ZermeloService.getQueryString();
      }

      vm.initialVersion
        .save()
        .then(
          function(versionResult) {
            if (vm.VERSION_NUM === 2) {
              $rootScope.$emit('queue.query.reset');
            }
            if (versionResult.slaId) {
              versionResult.slaName = _.find(vm.slas, { id: versionResult.slaId }).name;
            }
            queue.activeVersion = versionResult.version;
            queue.activeQueue = versionResult;
            queue.active = true;
            return queue.save();
          },
          function(response) {
            Alert.error($translate.instant('queue.create.invalid.query'));

            if (angular.isDefined(response.data.error.attribute.query)) {
              vm.copySelectedVersion(qv);

              $scope.$evalAsync(function() {
                vm.forms.versionForm.query.$setValidity('api', false);

                vm.forms.versionForm.query.$error = {
                  api: response.data.error.attribute.query
                };

                vm.forms.versionForm.query.$setTouched();

                var unbindErrorWatch = $scope.$watch(
                  function() {
                    return vm.forms.versionForm.query.$dirty;
                  },
                  function(dirtyValue) {
                    if (dirtyValue) {
                      vm.forms.versionForm.query.$setValidity('api', true);
                      unbindErrorWatch();
                    }
                  }
                );
              });
            }
          }
        )
        .finally(vm.updateVersions);
    };

    vm.fetchVersions = function() {
      if (!vm.selectedQueue || vm.selectedQueue.isNew()) {
        return [];
      } else {
        return QueueVersion.cachedQuery(
          {
            tenantId: Session.tenant.tenantId,
            queueId: vm.selectedQueue.id
          },
          'QueueVersion' + vm.selectedQueue.id
        );
      }
    };

    vm.copySelectedVersion = function(version) {
      if (version.queryVersion === 2) {
        $rootScope.$emit('queue.query.reset');
        ZermeloService.parseString(version.query);
      }
      vm.selectedQueueVersion = new QueueVersion({
        query: version.queryVersion === 2 ? ZermeloService.getQueryString() : version.query,
        name: 'v' + (vm.fetchVersions().length + 1),
        tenantId: version.tenantId,
        queueId: version.queueId,
        minPriority: version.minPriority,
        maxPriority: version.maxPriority,
        priorityValue: version.priorityValue,
        priorityRate: version.priorityRate,
        priorityUnit: version.priorityUnit,
        queryVersion: version.queryVersion,
        slaId: version.slaId || 'default'
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

    vm.updateActive = function() {
      var queueCopy = new Queue({
        id: vm.selectedQueue.id,
        tenantId: vm.selectedQueue.tenantId,
        active: !vm.selectedQueue.active
      });

      return queueCopy.save(function(result) {
        vm.selectedQueue.$original.active = result.active;
      });
    };

    $scope.$watch(
      function() {
        return vm.selectedQueue;
      },
      function(newValue) {
        // hack to fix partially removed selectedQueue cause by binding
        if (newValue && !(newValue instanceof Queue)) {
          vm.selectedQueue = null;
        }

        if (newValue && newValue instanceof Queue) {
          vm.updateVersions();
          vm.selectedQueue.reset(); //TODO: figure out why this is needed
        }
      }
    );

    $scope.$on(loEvents.tableControls.itemSelected, function() {
      vm.selectedQueueVersion = null;
    });

    vm.addQueueVersion = function() {
      if (vm.VERSION_NUM === 2) {
        $rootScope.$emit('queue.query.reset');
        angular.element('#queue-version-panel').css('display', 'table-cell');
      }
      vm.selectedQueueVersion = vm.getDefaultVersion();
      vm.selectedQueueVersion.queueId = vm.selectedQueue.id;
      vm.selectedQueueVersion.name = 'v' + (vm.fetchVersions().length + 1);
    };

    vm.saveVersion = function() {
      if (vm.selectedQueueVersion.queryVersion === 2) {
        vm.selectedQueueVersion.query = ZermeloService.getQueryString();
      }
      if (vm.selectedQueueVersion.slaId === 'default') {
        vm.selectedQueueVersion.slaId = vm.sessionTenant.defaultSlaId;
      }
      return vm.selectedQueueVersion
        .save()
        .then(function(version) {
          Alert.success($translate.instant('value.saveSuccess'));
          if (vm.selectedQueueVersion.queryVersion === 2) {
            $rootScope.$emit('queue.query.reset');
          }
          vm.selectedQueueVersion = null;
          if (version.slaId) {
            version.slaName = _.find(vm.slas, { id: version.slaId }).name;
          }
          return version;
        })
        .finally(vm.updateVersions);
    };

    vm.loadSlas();
  }
]);
