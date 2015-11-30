'use strict';

angular.module('liveopsConfigPanel')
  .controller('genericItemsController', ['$scope', '$stateParams', 'Session', 'List', 'ListType', 'loEvents', 'genericItemTableConfig',
    function ($scope, $stateParams, Session, List, ListType, loEvents, genericItemTableConfig) {
      var vm = this;

      vm.loadList = function () {
        if(!$stateParams.listId) {
          return;
        }

        $scope.list = List.cachedGet({
          id: $stateParams.listId,
          tenantId: Session.tenant.tenantId
        });

        $scope.list.$promise
          .then(function(list) {
            $scope.listType = ListType.cachedGet({
              id: list.listTypeId,
              tenantId: Session.tenant.tenantId
            });
            return $scope.listType.$promise;
          }).then(function() {
            $scope.tableConfig = genericItemTableConfig(
              $scope.list,
              $scope.listType
            );
          });
      };

      vm.create = function () {
        $scope.selectedItem = {};
      };

      $scope.submit = function () {
        if($scope.list.items.indexOf($scope.selectedItem) < 0) {
          $scope.list.items.push($scope.selectedItem);
        }
        
        return $scope.list.save({
          tenantId: Session.tenant.tenantId
        }).then(function(list) {
          $scope.controllers.reset.resetForm();
          return list;
        }, function() {
          $scope.loadList();
        });
      };
      
      $scope.$on(loEvents.tableControls.itemCreate, function () {
        vm.create();
      });
      
      $scope.$on(loEvents.tableControls.itemSelected, function (event, item, oldItem) {
        if(oldItem) {
          oldItem.$reset();
          $scope.controllers.reset.resetForm();
        };
      });
      
      //for some reason itemSelected wouldn't propagate back up to the parent
      //(even though it does for every other table view) so I had to put this in.
      $scope.$on(loEvents.tableControls.itemSelected, function(event, item) {
        $scope.selectedItem = item;
      });

      $scope.controllers = {};

      vm.loadList();
    }
  ]);
