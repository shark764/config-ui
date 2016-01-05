'use strict';

angular.module('liveopsConfigPanel')
  .controller('genericItemsController', ['$scope', '$state', '$stateParams', '$q', 'Session', 'List', 'ListType', 'loEvents', 'genericItemTableConfig',
    function($scope, $state, $stateParams, $q, Session, List, ListType, loEvents, genericItemTableConfig) {
      var vm = this;

      vm.loadList = function() {
        if (!$stateParams.listId) {
          return;
        }

        $scope.list = List.cachedGet({
          id: $stateParams.listId,
          tenantId: Session.tenant.tenantId
        });

        return $q.when($scope.list.$promise)
          .then(vm.loadListType)
          .then(vm.loadTableConfig);
      };

      vm.loadListType = function() {
        $scope.listType = ListType.cachedGet({
          id: $scope.list.listTypeId,
          tenantId: Session.tenant.tenantId
        });

        return $q.when($scope.listType.$promise);
      };

      vm.loadTableConfig = function() {
        $scope.tableConfig = genericItemTableConfig(
          $scope.list,
          $scope.listType,
          $state.current.name
        );
      };

      vm.onItemSelected = function(event, item, oldItem) {
        //for some reason itemSelected wouldn't propagate back up to the parent
        //(even though it does for every other table view) so I had to put this in.
        //TODO: investigate this further
        $scope.selectedItem = item;

        if (oldItem) {
          $scope.controllers.detailReset.reset(oldItem);
        }
      };

      vm.create = function create() {
        $scope.selectedItem = {};
      };

      $scope.submit = function() {
        if ($scope.selectedItem && $scope.list.items.indexOf($scope.selectedItem) < 0) {
          $scope.list.items.push($scope.selectedItem);
        }

        //destroy the itemSeleted handler to avoid redundant reset
        if (vm.destroyOnItemSelected) {
          vm.destroyOnItemSelected();
        }

        return $scope.list.save({
          tenantId: Session.tenant.tenantId
        }).then(function(list) {
          //reset the form
          $scope.controllers.detailReset.resetForm();
          
          return list;
        }, vm.loadList
        ).finally(function() {
          vm.destroyOnItemSelected =
            $scope.$on(loEvents.tableControls.itemSelected, vm.onItemSelected);
        });
      };

      $scope.$on(loEvents.tableControls.itemCreate, function() {
        vm.create();
      });

      vm.destroyOnItemSelected = $scope.$on(loEvents.tableControls.itemSelected, vm.onItemSelected);

      $scope.controllers = {};
      
      vm.loadList();
    }
  ]);
