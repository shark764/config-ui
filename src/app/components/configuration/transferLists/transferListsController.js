'use strict';

angular.module('liveopsConfigPanel')
  .controller('transferListsController', ['transferListsTableConfig', 'transferTypes', 'contactTypes', 'Flow', 'Queue', 'TransferList', 'Session', '$scope', '$timeout', '$translate', '$q', 'Modal', 'Alert', 'loEvents', function (transferListsTableConfig, transferTypes, contactTypes, Flow, Queue, TransferList, Session, $scope, $timeout, $translate, $q, Modal, Alert, loEvents) {
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
    vm.disableDoneLink = false;

    vm.sortableOptions = {
      update: function () {
        $scope.forms.detailsForm.endpoints.$setDirty();
      },
      stop: function () {
        sortByCategoryName();
      }
    };

    vm.sortableOptionsSingleCategory = {
      stop: function () {
        $scope.forms.detailsForm.endpoints.$setDirty();
      }
    };

    function sortByCategoryName() {
      var sortedEndpoints = [];

      _.map(vm.categories, function (categoryVal) {
        _.each(vm.selectedTransferList.endpoints, function (endpointVal) {
          if (endpointVal.hierarchy === categoryVal) {
            sortedEndpoints.push(endpointVal);
          }
        });
      });

      delete vm.selectedTransferList.endpoints;
      vm.selectedTransferList.endpoints = sortedEndpoints;
      vm.categories = listCategories(vm.selectedTransferList.endpoints, 'hierarchy');
    }

    function convertToStr (val) {
      if (!val) {
        return;
      }

      return val.toString();
    }

    function getFlowQueueData(currentCategory) {
      return $q.all([
          vm.fetchFlows().$promise,
          vm.fetchQueues().$promise
        ])
        .then(function (values) {
          var flows = values[0];
          var queues = values[1];
          if (currentCategory.contactType === 'queue' && typeof currentCategory.endpoint === 'string') {
            currentCategory.endpoint = queues.filter(function (queue) {
              return queue.id === currentCategory.endpoint;
            })[0];

            if (currentCategory.endpoint === undefined) {
              vm.queueError = true;
              return;
            }
          } else if (currentCategory.contactType === 'flow' && typeof currentCategory.endpoint === 'string') {
            currentCategory.endpoint = flows.filter(function (flow) {
              return flow.id === currentCategory.endpoint;
            })[0];
            if (currentCategory.endpoint === undefined) {
              vm.flowError = true;
              return;
            }
          }

          return currentCategory;
        });
    }
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
        }
        return val;
      });
    }
    function listCategories(endpoints, property) {
      vm.selectedTransferList.endpoints = addTempIdx(endpoints);
      var categories = _.map(vm.selectedTransferList.endpoints, property);
      return _.uniq(categories);
    }
    function clearContactFormData () {
      vm.selectedContact = null;
      vm.openEditPanel = false;
      vm.newTransferList = false;
      $scope.forms.contactForm.$setPristine();
      $scope.forms.contactForm.$setUntouched();
    }
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
        vm.selectedCategory = null;
      } else {
        vm.selectedTransferList.endpoints[vm.selectedEndpointIdx] = angular.copy(vm.selectedContactBackup);
      }
      clearContactFormData();
    };

    vm.createContact = function (endpoints) {
      // if we don't any have categories yet
      if (!angular.isArray(vm.categories) || angular.isArray(vm.categories) && vm.categories.length < 1) {
        vm.editingCategoryName = true;
        vm.newTransferList = true;
      } else {
        vm.editingCategoryName = false;
        vm.newTransferList = false;
      }
      vm.endpoints = endpoints;
      vm.selectedContact = {};
      vm.selectedContact.isNew = function () {
        return true;
      };
      vm.selectedCategory = null;
      vm.openEditPanel = true;
      $scope.forms.contactForm.$setPristine();
      $scope.forms.contactForm.$setUntouched();
    };

    vm.editContact = function (endpointData, category) {
      getFlowQueueData(endpointData).then(function (response) {
        var endpoint = response;
        vm.openEditPanel = true;
        vm.selectedContact = endpoint;
        vm.selectedContactBackup = angular.copy(vm.selectedContact);
        vm.selectedEndpointIdx = endpoint.tempIdx;
        vm.selectedCategory = category;
        vm.editingCategoryName = false;
        vm.newTransferList = false;
        vm.selectedContact.warmTransfer = convertToStr(vm.selectedContact.warmTransfer);
        vm.selectedContact.coldTransfer = convertToStr(vm.selectedContact.coldTransfer);
        $scope.forms.contactForm.$setPristine();
        $scope.forms.contactForm.$setUntouched();
      });
    };

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

    vm.activeQueues = Queue.cachedQuery({
      tenantId: Session.tenant.tenantId,
      active: true
    });

    vm.removeContact = function (indexToDelete) {
      _.remove(vm.selectedTransferList.endpoints, {
        tempIdx: indexToDelete
      });
      vm.categories = listCategories(vm.selectedTransferList.endpoints, 'hierarchy');
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

    vm.getEndpointsByHierarchy = function (categoryName, endpoints) {
      return _.filter(endpoints, function (val) {
        return categoryName === val.hierarchy;
      });
    };

    vm.preventEmpty = function (index) {
      var textInput = angular.element('.category' + index).val();
      if (textInput.length > 0) {
        vm.disableDoneLink = false;
      } else {
        vm.disableDoneLink = true;
      }
    };

    vm.updateCategoryName = function (prevName, index) {
      if (vm.disableDoneLink === true) {
        return;
      }

      var newName = angular.element('.category' + index).val();
      angular.element('.hidden-category' + index).val(newName);

      _.each(vm.selectedTransferList.endpoints, function (val, key) {
        if (val.hierarchy === prevName) {
          vm.selectedTransferList.endpoints[key].hierarchy = newName;
        }
      });

      vm.categories = listCategories(vm.selectedTransferList.endpoints, 'hierarchy');
      $scope.forms.detailsForm.endpoints.$setDirty();
    };

    vm.saveContact = function () {
      $q.all([
          vm.fetchFlows().$promise,
          vm.fetchQueues().$promise
        ])
        .then(function (values) {
          var flows = values[0];
          var queues = values[1];
          vm.selectedContact.hierarchy = vm.selectedCategory;
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

          vm.categories = listCategories(vm.selectedTransferList.endpoints, 'hierarchy');

          vm.newTransferList = false;
          vm.flowError = false;
          vm.queueError = false;
          vm.selectedContact = null;
          vm.openEditPanel = false;

          $scope.forms.detailsForm.$setDirty();
        });
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

        // Convert string value to boolean,
        // to avoid conflicts on expected values
        if (item.hasOwnProperty('warmTransfer')) {
          item.warmTransfer = (item.warmTransfer === 'true');
        }
        if (item.hasOwnProperty('coldTransfer')) {
          item.coldTransfer = (item.coldTransfer === 'true');
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
      delete vm.categories;
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
      if (vm.openEditPanel === true) {
        clearContactFormData();
      }
      vm.replaceResources();
      $timeout(function () {
        if (vm.selectedTransferList) {
          vm.categories = listCategories(vm.selectedTransferList.endpoints, 'hierarchy');
        }
      });
    });
  }]);
