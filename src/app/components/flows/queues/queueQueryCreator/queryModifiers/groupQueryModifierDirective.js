'use strict';

angular.module('liveopsConfigPanel')
  .directive('groupQueryModifier', [
    function () {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/flows/queues/queueQueryCreator/queryModifiers/templates/groupQuery.html',
        scope: {
          parentMap: '=',
          query: '=',
          labelKey: '@',
          placeholderKey: '@',
          operator: '@'
        },
        controller: 'groupQueryController',
        link: function($scope, elem, attr, controller) {
          $scope.$watch('query', function (newQuery) {
            if (!newQuery) {
              return;
            }
            
            $scope.operands = controller.parseOperands();
          });
          
          $scope.$watch('typeaheadItem', function (item) {
            if (angular.isString(item)) {
              $scope.selected = null;
              return;
            }
            
            $scope.selected = item;
          });
        }
      };
    }
  ]);