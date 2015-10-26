'use strict';

angular.module('liveopsConfigPanel')
  .directive('bulkActionExecutor', ['$q', 'Alert', 'Modal', '$translate', 'DirtyForms', '$filter',
    function ($q, Alert, Modal, $translate, DirtyForms, $filter) {
      return {
        restrict: 'AE',
        replace: true,
        scope: {
          items: '=',
          bulkActions: '=',
          showBulkActions: '=',
          dropOrderBy: '@',
          confirmMessageKey: '@'
        },
        transclude: true,
        templateUrl: 'app/shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        link: function ($scope) {
          if (! $scope.confirmMessageKey){
            $scope.confirmMessageKey = 'bulkActions.confirm.message';
          }
          
          $scope.checkedItems = [];

          $scope.confirmExecute = function () {
            Modal.showConfirm({
              title: $translate.instant('bulkActions.confirm.title'),
              message: $translate.instant($scope.confirmMessageKey, {
                numItems: $scope.selectedItems().length
              }),
              okCallback: $scope.execute
            });
          };

          $scope.closeBulk = function () {
            DirtyForms.confirmIfDirty(function () {
              $scope.$emit('details:panel:close');
            });
          };

          $scope.execute = function () {
            var selectedBulkActions = $scope.getSelectedBulkActions($scope.bulkActions);
            var itemPromises = [];
            
            //Prevent unsaved changes warning from triggering if all items are
            //filtered out of the table and the bulk actions panel auto-closes
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();
            
            angular.forEach(selectedBulkActions, function (bulkAction) {
              if (bulkAction.canExecute()) {
                var selectedItems = $scope.getSelectedBulkActions($scope.items);
                itemPromises.push($q.when(bulkAction.execute(selectedItems)));
              }
            });

            var promise = $q.all(itemPromises).then(function () {
              Alert.success($translate.instant('bulkAction.success'));
              $scope.resetForm();
            });

            return promise;
          };

          $scope.canExecute = function () {
            var selectedBulkActions = $scope.getSelectedBulkActions($scope.bulkActions);
            var canExecute = !!selectedBulkActions.length;

            if( $scope.selectedItems().length === 0 ){
              return false;
            }

            angular.forEach(selectedBulkActions, function (bulkAction) {
              canExecute = canExecute && bulkAction.canExecute();
            });

            return canExecute;
          };

          $scope.getSelectedBulkActions = function (items) {
            var selectedItems = [];
            angular.forEach(items, function (item) {
              if (item.checked) {
                selectedItems.push(item);
              }
            });

            return selectedItems;
          };

          $scope.selectedItems = function () {
            $scope.checkedItems.clear();
            angular.forEach($scope.items, function (item) {
              if(item.checked) {
                $scope.checkedItems.push(item);
              }
            });

            if ($scope.dropOrderBy){
              //Reorder elements while preserving original object reference to avoid infinite digest loop
              var sorted = $filter('orderBy')($scope.checkedItems, $scope.dropOrderBy);
              $scope.checkedItems.clear();
              $scope.checkedItems.push.apply($scope.checkedItems, sorted);
            }
            
            return $scope.checkedItems;
          };

          $scope.cancel = function () {
            DirtyForms.confirmIfDirty(function () {
              if ($scope.bulkActionForm.$dirty){
                $scope.resetForm();
              } else {
                $scope.closeBulk();
              }
            });
          };

          $scope.resetForm = function () {
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();
            angular.forEach($scope.bulkActions, function (bulkAction) {
              bulkAction.reset();
            });
          };

          $scope.$watch('showBulkActions', function (newValue) {
            if (!newValue) {
              $scope.resetForm();
            }
          });
        }
      };
    }
  ]);
