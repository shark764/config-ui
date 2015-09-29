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