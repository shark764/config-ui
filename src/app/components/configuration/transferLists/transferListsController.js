'use strict';

angular.module('liveopsConfigPanel')
  .controller('transferListsController', ['transferListsTableConfig', 'transferTypes', 'contactTypes', 'Flow', 'Queue', 'TransferList', 'Session', '$scope', '$timeout', '$translate', '$q', 'Modal', 'Alert', 'loEvents', function (transferListsTableConfig, transferTypes, contactTypes, Flow, Queue, TransferList, Session, $scope, $timeout, $translate, $q, Modal, Alert, loEvents) {
    var vm = this;
    $scope.forms = {};
    $scope.err = false;
    vm.tableConfig = transferListsTableConfig;
    vm.transferTypes = transferTypes;
    vm.contactTypes = contactTypes;
    vm.openEditPanel = false;
    vm.sipPattern = '[s|S]{1}[i|I]{1}[p|P]{1}:.*';
    vm.formsFilled = false;

    vm.sortableOptions = {
      update: function (e, ui) {
        $scope.forms.detailsForm.endpoints.$setDirty();
      }
    };

    function getFlowQueueData(currentProduct) {
      return $q.all([
          vm.fetchFlows().$promise,
          vm.fetchQueues().$promise
        ])
        .then(function (values) {
          var flows = values[0];
          var queues = values[1];
          if (currentProduct.contactType === 'queue' && typeof currentProduct.endpoint === 'string') {
            currentProduct.endpoint = queues.filter(function (queue) {
              return queue.id === currentProduct.endpoint;
            })[0];

            if (currentProduct.endpoint === undefined) {
              vm.queueError = true;
              return;
            }
          } else if (currentProduct.contactType === 'flow' && typeof currentProduct.endpoint === 'string') {
            currentProduct.endpoint = flows.filter(function (flow) {
              return flow.id === currentProduct.endpoint;
            })[0];
            if (currentProduct.endpoint === undefined) {
              vm.flowError = true;
              return;
            }
          }

          return currentProduct;
        });
    };

    function addTempIdx(endpointObj) {
      // add a temporary index to be used in lieu of a unique key
      // for the endpoints
      return _.map(endpointObj, function (val, key) {
        if (val.hasOwnProperty('tempIdx')) {
          val.tempIdx = key;
        } else {
          _.merge(val, {
            tempIdx: key
          });
        };

        return val;
      });
    };

    vm.checkContactType = function () {
      vm.selectedContact.overrideHide = true;
      if (vm.selectedContact.contactType === 'queue' || vm.selectedContact.contactType === 'flow') {
        vm.selectedContact.transferType = 'internal';
      }

      vm.selectedContact.endpoint = null;
      vm.flowError = false;
      vm.queueError = false;
    };

    vm.cancelContact = function () {
      vm.selectedTransferList.endpoints[vm.selectedEndpointIdx] = angular.copy(vm.selectedContactBackup);

      vm.selectedContact = null;
      vm.openEditPanel = false;
      $scope.forms.contactForm.$setPristine();
      $scope.forms.contactForm.$setUntouched();
    };

    vm.createContact = function (endpoints) {
      vm.endpoints = endpoints;
      vm.selectedContact = {};
      vm.selectedContact.isNew = function () {
        return true;
      };
      vm.overrideHide = false;
      vm.openEditPanel = true;
      $scope.forms.contactForm.$setPristine();
      $scope.forms.contactForm.$setUntouched();
    };

    vm.editContact = function (endpointData) {
      getFlowQueueData(endpointData).then(function (response) {
        var endpoint = response;
        vm.openEditPanel = true;
        vm.selectedContact = endpoint;
        vm.selectedContact.overrideHide = true;
        vm.selectedContactBackup = angular.copy(vm.selectedContact);
        vm.selectedEndpointIdx = endpoint.tempIdx;
        $scope.forms.contactForm.$setPristine();
        $scope.forms.contactForm.$setUntouched();
      })
    }

    vm.fetchFlows = function () {
      return Flow.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
    };

    vm.transferLists = TransferList.cachedQuery({
      tenantId: Session.tenant.tenantId
    });

    vm.fetchQueues = function () {
      return Queue.cachedQuery({
        tenantId: Session.tenant.tenantId
      });
    };

    vm.removeContact = function (indexToDelete) {
      _.remove(vm.selectedTransferList.endpoints, {
        tempIdx: indexToDelete
      });
      vm.selectedTransferList.endpoints = addTempIdx(vm.selectedTransferList.endpoints);
      $scope.forms.detailsForm.$setDirty();
    };

    vm.replaceResources = function () {
      if (angular.isObject(vm.selectedTransferList)) {
        // replace flow/queue ID's with flow/queue resources
        vm.fetchFlows().$promise.then(function (flows) {
          vm.selectedTransferList.endpoints.map(function (endpoint) {
            if (endpoint.contactType === 'flow') {
              endpoint.endpoint = flows.filter(function (flow) {
                return flow.id === endpoint.endpoint;
              })[0];
            }
          });
        });

        vm.fetchQueues().$promise.then(function (queues) {
          vm.selectedTransferList.endpoints.map(function (endpoint) {
            if (endpoint.contactType === 'queue') {
              endpoint.endpoint = queues.filter(function (queue) {
                return queue.id === endpoint.endpoint;
              })[0];
            }
          });
        });
      }
    };

    vm.selectItem = function (item) {
      vm.selectedContact = item;
      vm.selectedContact.isNew = function () {
        return false;
      };
    };

    vm.saveContact = function () {
      $q.all([
          vm.fetchFlows().$promise,
          vm.fetchQueues().$promise
        ])
        .then(function (values) {
          var flows = values[0];
          var queues = values[1];
          if (vm.selectedContact.contactType === 'queue' && typeof vm.selectedContact.endpoint === 'string') {
            vm.selectedContact.endpoint = queues.filter(function (queue) {
              return queue.name === vm.selectedContact.endpoint;
            })[0];

            if (vm.selectedContact.endpoint === undefined) {
              vm.queueError = true;
              return;
            }
          } else if (vm.selectedContact.contactType === 'flow' && typeof vm.selectedContact.endpoint === 'string') {
            vm.selectedContact.endpoint = flows.filter(function (flow) {
              return flow.name === vm.selectedContact.endpoint;
            })[0];
            if (vm.selectedContact.endpoint === undefined) {
              vm.flowError = true;
              return;
            }
          }
          if (angular.isFunction(vm.selectedContact.isNew) && vm.selectedContact.isNew()) {
            delete vm.selectedContact.isNew;
            vm.selectedTransferList.endpoints.push(vm.selectedContact);
          }

          vm.selectedTransferList.endpoints = addTempIdx(vm.selectedTransferList.endpoints);

          vm.flowError = false;
          vm.queueError = false;
          vm.selectedContact = null;
          vm.openEditPanel = false;

          $scope.forms.detailsForm.$setDirty();
        })
    };

    vm.submit = function () {
      // replace flow/queue resources with flow/queue id's
      vm.selectedTransferList.endpoints = vm.selectedTransferList.endpoints.map(function (item) {
        if (item.hasOwnProperty('tempIdx')) {
          delete item.tempIdx;
        }

        if (item.contactType === 'flow' || item.contactType === 'queue') {
          if (item.endpoint.hasOwnProperty('id')) {
            item.endpoint = item.endpoint.id;
          }
        }
        return item;
      });

      return vm.selectedTransferList.save({
        tenantId: Session.tenant.tenantId
      }, function (resp) {
        vm.selectedTransferList = resp;
        vm.replaceResources();
      });
    };

    vm.updateActive = function () {
      vm.selectedTransferList.active = !vm.selectedTransferList.active;
      vm.submit();
    };

    $scope.$on(loEvents.tableControls.itemCreate, function () {
      vm.selectedContact = null;
      vm.openEditPanel = false;

      vm.selectedTransferList = new TransferList({
        tenantId: Session.tenant.tenantId,
        active: true,
        endpoints: []
      });
    });

    $scope.$on(loEvents.bulkActions.close, function () {
      vm.cancelContact();
    });

    $scope.$on(loEvents.tableControls.itemSelected, function () {
      vm.replaceResources();
      $timeout(function () {
        if (vm.selectedTransferList) {
          vm.selectedTransferList.endpoints = addTempIdx(vm.selectedTransferList.endpoints);
        }
      });
    });
  }]);
