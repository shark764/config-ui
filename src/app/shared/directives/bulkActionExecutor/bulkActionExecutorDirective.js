'use strict';

angular.module('liveopsConfigPanel')
  .directive('bulkActionExecutor', ['$q',
    function ($q) {
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
              angular.forEach($scope.bulkActions, function(bulkAction) {
                if(!bulkAction.checked){
                  return;
                }
                
                promises.push($q.when(bulkAction.action(itemCopy)));
              });
              
              if(promises.length) {
                $q.all(promises).then(function() {
                  var promise = itemCopy.$save();
                  promise = promise.then(function(itemSuccess) {
                    angular.copy(itemSuccess, item);
                    item.checked = true; //keep the item checked after exec
                    return item;
                  });
                });
              }
            });
          };
          
          $scope.updateDropDown = function(event, item) {
            setTimeout(function() {
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