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
          $scope.execute = function() {
            var promises = [];
            angular.forEach($scope.bulkActions, function(bulkAction) {
              if(!bulkAction.selected){
                return;
              }
              angular.forEach($scope.items, function(item) {
                if(!item.checked) {
                  return;
                }
                
                var itemCopy = angular.copy(item);
                var promise = $q.when(bulkAction.action(itemCopy));
                promise = promise.then(function(itemSuccess) {
                  angular.copy(itemSuccess, item);
                  return item;
                });
                promises.push(promise);
              });
            });
          }
        }
      };
    }
  ]);