'use strict';

angular.module('liveopsConfigPanel')
  .controller('genericListsController', ['$scope', '$filter', '$q', 'Session', 'List', 'ListType', 'genericListTableConfig', 'loEvents',
    function ($scope, $filter, $q, Session, List, ListType, genericListTableConfig, loEvents) {
      var vm = this;

      vm.create = function () {
        vm.selectedList = new List();
      };

      vm.loadLists = function () {
        vm.lists = List.cachedQuery({
          tenantId: Session.tenant.tenantId
        });

        vm.lists.$promise
          .then(vm.loadPermissions)
          .then(vm.loadListTypes);

        return vm.lists;
      };

      vm.loadPermissions = function (lists) {
        angular.forEach(lists, function (list) {
          list.$inherited = (list.tenantId !== Session.tenant.tenantId);
        });

        return lists;
      };

      vm.loadListTypes = function (lists) {
        var promises = [];
        angular.forEach(lists, function (list) {
          list.$listType = ListType.cachedGet({
            tenantId: list.tenantId,
            id: list.listTypeId
          });
          
          promises.push(list.$listType.$promise);
        });
        
        return $q.all(promises);
      };

      vm.submit = function () {
        return vm.selectedList.save({
          tenantId: vm.selectedList.tenantId
        });
      };

      vm.addListItem = function addListItem() {
        var newItem = {
          $edit: true
        };

        vm.selectedList.items.push(newItem);
        vm.selectedList.$original.items.push(newItem);

        return newItem;
      };

      vm.removeListItem = function removeListItem(index) {
        vm.selectedList.items.splice(index, 1);
        vm.forms.detailsForm.$setDirty();
      };

      $scope.$on(loEvents.tableControls.itemCreate, function () {
        vm.create();
      });

      vm.loadLists();

      vm.tableConfig = genericListTableConfig;
      vm.forms = {};
    }
  ]);
