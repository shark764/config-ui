'use strict';

angular.module('liveopsConfigPanel')
  .directive('groupQuery', ['jsedn',
    function (jsedn) {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/flows/queues/queueQueryCreator/queryModifiers/templates/readonlyGroupQuery.html',
        scope: {
          query: '=',
          labelKey: '@',
          operator: '@'
        },
        controller: 'groupQueryController',
        link: function($scope, elem, attr, controller) {
          $scope.$watch('query', function (newQuery) {
            if (!newQuery) {
              return;
            }
            
            $scope.parentMap = jsedn.parse($scope.query);
            $scope.operands = controller.parseOperands();
          });
        }
      };
    }
  ]);