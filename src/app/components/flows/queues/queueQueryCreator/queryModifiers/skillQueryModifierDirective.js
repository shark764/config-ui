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
          $scope.$watch('query', function (newQuery, oldQuery) {
            if (!newQuery) {
              return;
            }

            $scope.operands = controller.parseOperands();
          });
        }
      };
    }
  ]);