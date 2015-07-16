'use strict';

angular.module('liveopsConfigPanel')
  .directive('bulkActionExecutor', ['$q', '$timeout', 'Alert', 'DirtyForms',
    function ($q, $timeout, Alert, DirtyForms) {
      return {
        restrict: 'AE',
        scope: {
          items: '=',
          bulkActions: '='
        },
        transclude: true,
        templateUrl: 'app/shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        link: function ($scope) {
          $scope.checkedItems = [];

          $scope.execute = function () {
            var selectedBulkActions = $scope.getSelectedItems($scope.bulkActions);
            var itemPromises = [];
            angular.forEach(selectedBulkActions, function (bulkAction) {
              if (bulkAction.canExecute()) {
                var selectedItems = $scope.getSelectedItems($scope.items);
                itemPromises.push($q.when(bulkAction.execute(selectedItems)));
              }
            });

            var promise = $q.all(itemPromises).then(function () {
              $scope.bulkActionForm.$setUntouched();
              $scope.bulkActionForm.$setPristine();
              $scope.resetBulkActions();
              Alert.success('Bulk action successful!');
            });

            return promise;
          };
          
          $scope.resetBulkActions = function(){
            angular.forEach($scope.bulkActions, function(action){
              action.reset();
            })
          };

          $scope.canExecute = function () {
            var selectedBulkActions = $scope.getSelectedItems($scope.bulkActions);
            var canExecute = !!selectedBulkActions.length;
            angular.forEach(selectedBulkActions, function (bulkAction) {
              canExecute = canExecute && bulkAction.canExecute();
            });

            return canExecute;
          };

          $scope.getSelectedItems = function (items) {
            var selectedItems = [];
            angular.forEach(items, function (item) {
              if (item.checked) {
                selectedItems.push(item);
              }
            });

            return selectedItems;
          };

          $scope.updateDropDown = function (event, item) {
            $timeout(function () {
              if (item.checked && $scope.checkedItems.indexOf(item) < 0) {
                $scope.checkedItems.push(item);
              } else {
                $scope.checkedItems.removeItem(item);
              }
              $scope.$apply();
            }, 5);
          };
          
          $scope.cancel = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.bulkActionForm.$setUntouched();
              $scope.bulkActionForm.$setPristine();
              $scope.$emit('bulk:action:cancel');
            });
          };

          $scope.$on('table:resource:checked', $scope.updateDropDown);
          $scope.$on('dropdown:item:checked', $scope.updateDropDown);
        }
      };
    }
  ]);
