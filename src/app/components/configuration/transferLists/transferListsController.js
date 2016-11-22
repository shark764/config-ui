'use strict';

angular.module('liveopsConfigPanel')
  .controller('transferListsController', ['transferListsTableConfig', 'transferTypes', 'contactTypes', 'Flow', 'Queue', 'TransferList', 'Session', '$scope', '$timeout', '$translate', '$q', 'loEvents', 'Modal', 'Alert', function (transferListsTableConfig, transferTypes, contactTypes, Flow, Queue, TransferList, Session, $scope, $timeout, $translate, $q, loEvents, Modal, Alert) {
    var vm = this;
    $scope.forms = {};
    $scope.err = false;
    vm.tableConfig = transferListsTableConfig;
    vm.transferTypes = transferTypes;
    vm.contactTypes = contactTypes;
    vm.showInput = [];
    vm.openEditPanel = false;
    vm.sipPattern = '[s|S]{1}[i|I]{1}[p|P]{1}:.*';
    vm.formsFilled = false;

    vm.sortableOptions = {
      update: function (e, ui) {
        $scope.forms.detailsForm.endpoints.$setDirty();
      },
      stop: function () {
        sortByProductName();
      }
    };

    function sortByProductName() {
      var sortedEndpoints = [];

      _.map(vm.products, function (productVal, productKey) {
        _.each(vm.selectedTransferList.endpoints, function (endpointVal, endpointKey) {
          if (endpointVal.hierarchy === productVal) {
            sortedEndpoints.push(endpointVal);
          }
        });
      });

      delete vm.selectedTransferList.endpoints;
      vm.selectedTransferList['endpoints'] = sortedEndpoints;
      vm.products = listProducts(vm.selectedTransferList.endpoints, 'hierarchy');
    }

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

    function listProducts(endpoints, property) {
      vm.selectedTransferList.endpoints = addTempIdx(endpoints);
      var products = _.map(vm.selectedTransferList.endpoints, property);
      return _.uniq(products);
    };

    vm.checkContactType = function () {
      if (vm.selectedContact.contactType === 'queue' || vm.selectedContact.contactType === 'flow') {
        vm.selectedContact.transferType = 'internal';
      }
      vm.selectedContact.endpoint = null;
      vm.flowError = false;
      vm.queueError = false;
    };

    vm.cancelContact = function () {
      if (vm.openEditPanel !== true) {
        vm.selectedProduct = null;
      } else {
        vm.selectedTransferList.endpoints[vm.selectedEndpointIdx] = angular.copy(vm.selectedContactBackup);
      }

      vm.selectedContact = null;
      vm.openEditPanel = false;
      vm.newTransferList = false;
      $scope.forms.contactForm.$setPristine();
      $scope.forms.contactForm.$setUntouched();
    };

    vm.createContact = function (endpoints) {
      // if we don't any have products yet
      if (!angular.isArray(vm.products) || angular.isArray(vm.products) && vm.products.length < 1) {
        vm.editingProductName = true;
        vm.newTransferList = true;
      } else {
        vm.editingProductName = false;
        vm.newTransferList = false;
      }
      vm.endpoints = endpoints;
      vm.selectedContact = {};
      vm.selectedContact.isNew = function () {
        return true;
      };
      vm.selectedProduct = null;
      $scope.forms.contactForm.$setPristine();
      $scope.forms.contactForm.$setUntouched();
    };

    vm.editContact = function (endpointData, product) {
      getFlowQueueData(endpointData).then(function (response) {
        var endpoint = response;
        vm.openEditPanel = true;
        vm.selectedContact = endpoint;
        vm.selectedContactBackup = angular.copy(vm.selectedContact);
        vm.selectedEndpointIdx = endpoint.tempIdx;
        vm.selectedProduct = product;
        vm.editingProductName = false;
        vm.newTransferList = false;
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
      vm.products = listProducts(vm.selectedTransferList.endpoints, 'hierarchy');
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

    vm.getEndpointsByHierarchy = function (productName, endpoints, bypass) {
      return _.filter(endpoints, function (val) {
        return productName === val.hierarchy;
      });
    };

    vm.updateProductName = function (prevName, index) {
      var newName = angular.element('.product' + index).val();
      angular.element('.hidden-product' + index).val(newName);

      _.each(vm.selectedTransferList.endpoints, function (val, key) {
        if (val.hierarchy === prevName) {
          vm.selectedTransferList.endpoints[key].hierarchy = newName;
        }
      });

      vm.products = listProducts(vm.selectedTransferList.endpoints, 'hierarchy');
      $scope.forms.detailsForm.endpoints.$setDirty();
    }

    vm.saveContact = function () {
      $q.all([
          vm.fetchFlows().$promise,
          vm.fetchQueues().$promise
        ])
        .then(function (values) {
          var flows = values[0];
          var queues = values[1];
          vm.selectedContact['hierarchy'] = vm.selectedProduct;
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

          vm.products = listProducts(vm.selectedTransferList.endpoints, 'hierarchy');

          vm.newTransferList = false;
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
      delete vm.products;
      vm.selectedContact = null;
      vm.openEditPanel = false;

      vm.selectedTransferList = new TransferList({
        tenantId: Session.tenant.tenantId,
        active: true,
        endpoints: []
      });
    });

    $scope.$on(loEvents.tableControls.itemSelected, function () {
      vm.replaceResources();
      delete vm.products;
      $timeout(function () {
        if (vm.selectedTransferList) {
          vm.products = listProducts(vm.selectedTransferList.endpoints, 'hierarchy');
        }
      });
    });
  }]);
