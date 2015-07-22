'use strict';

angular.module('liveopsConfigPanel')
  .directive('bulkActionExecutor', ['$q', '$timeout', 'Alert', 'Modal', '$translate', 'DirtyForms',
    function ($q, $timeout, Alert, Modal, $translate, DirtyForms) {
      return {
        restrict: 'AE',
        scope: {
          items: '=',
          bulkActions: '=',
          showBulkActions: '=',
          selectedDisplay: '@'
        },
        transclude: true,
        templateUrl: 'app/shared/directives/bulkActionExecutor/bulkActionExecutor.html',
        link: function ($scope) {
          $scope.checkedItems = [];

          $scope.confirmExecute = function(){
            Modal.showConfirm({
              title: $translate.instant('bulkActions.confirm.title'),
              message: $translate.instant('bulkActions.confirm.message', {numItems: $scope.checkedItems.length}),
              okCallback: $scope.execute
            });
          };

          $scope.closeBulk = function () {
            DirtyForms.confirmIfDirty(function(){
              $scope.showBulkActions = false;
            });
          };

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
              Alert.success('Bulk action successful!');
              $scope.resetForm();
            });

            return promise;
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
              $scope.resetForm();
            });
          };

          $scope.resetForm = function() {
            $scope.bulkActionForm.$setUntouched();
            $scope.bulkActionForm.$setPristine();
            angular.forEach($scope.bulkActions, function(bulkAction) {
              bulkAction.reset();
            });
          };

          $scope.$on('table:resource:checked', $scope.updateDropDown);
          $scope.$on('dropdown:item:checked', $scope.updateDropDown);
          
          $scope.$watch('showBulkActions', function(newValue){
            if (!newValue){
              $scope.resetForm();
            }
          });
        }
      };
    }
  ]);
