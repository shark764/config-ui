'use strict';

angular.module('liveopsConfigPanel')
  .directive('skillQueryModifier', [
    function () {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/flows/queues/queueQueryCreator/queryModifiers/templates/skillQuery.html',
        scope: {
          parentMap: '=',
          query: '=',
          labelKey: '@',
          placeholderKey: '@',
          operator: '@'
        },
        controller: 'skillQueryController',
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
          
          $scope.add = controller.add;
          $scope.remove = controller.remove;
          $scope.filterSkills = controller.filterSkills;
        }
      };
    }
  ]);