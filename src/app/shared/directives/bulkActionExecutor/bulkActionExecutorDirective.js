'use strict';

angular.module('liveopsConfigPanel')
  .directive('bulkActionExecutor', ['$q', '$timeout', 'Alert',
    function ($q, $timeout, Alert) {
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
          
          $scope.execute = function() {
            angular.forEach($scope.items, function(item) {
              if(!item.checked) {
                return;
              }
              
              var promises = [];
              var itemCopy = angular.copy(item);
              
              var selectedBulkActions = $scope.getBulkActionsSelected();
              angular.forEach(selectedBulkActions, function(bulkAction) {
                if(bulkAction.canExecute()) {
                  promises.push($q.when(bulkAction.execute(itemCopy)));
                }
              });
              
              if(promises.length) {
                $q.all(promises).then(function() {
                  var promise = itemCopy.save();
                  promise = promise.then(function(itemSuccess) {
                    angular.copy(itemSuccess, item);
                    item.checked = true; //keep the item checked after exec
                    return item;
                  });
                  
                  promise = promise.then(function() {
                    Alert.success('Bulk action successful!');
                  });
                });
              }
            });
          };
          
          $scope.canExecute = function() {
            var selectedBulkActions = $scope.getBulkActionsSelected();
            var canExecute = !!selectedBulkActions.length;
            angular.forEach(selectedBulkActions, function(bulkAction) {
              canExecute = canExecute && bulkAction.canExecute();
            });
            
            return canExecute;
          };
          
          $scope.getBulkActionsSelected = function() {
            var selectedBulkActions = [];
            angular.forEach($scope.bulkActions, function(bulkAction) {
              if(bulkAction.checked){
                selectedBulkActions.push(bulkAction);
              }
            });
            
            return selectedBulkActions;
          };
          
          $scope.updateDropDown = function(event, item) {
            $timeout(function() {
              if(item.checked) {
                $scope.checkedItems.push(item);
              } else {
                $scope.checkedItems.removeItem(item);
              }
              $scope.$apply();
            }, 5);
            
            
          };
          
          $scope.$on('table:resource:checked', $scope.updateDropDown);
          $scope.$on('dropdown:item:checked', $scope.updateDropDown);
        }
      };
    }
  ]);