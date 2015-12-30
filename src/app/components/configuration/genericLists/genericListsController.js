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
          .then(vm.loadListTypes);

        return vm.lists;
      };

      vm.loadListTypes = function (lists) {
        ListType.cachedQuery({
          tenantId: Session.tenant.tenantId
        }).$promise.then(function (listTypes) {
          angular.forEach(lists, function (list) {
            var listType = $filter('filter')(listTypes, {
              id: list.listTypeId
            })[0];

            list.$listType = listType;
          });
        });
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
        vm.forms.detailsForm.$setDirty();

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
