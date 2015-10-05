'use strict';

angular.module('liveopsConfigPanel')
  .directive('skillQuery', ['jsedn',
    function (jsedn) {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/flows/queues/queueQueryCreator/queryModifiers/templates/readonlySkillQuery.html',
        scope: {
          query: '=',
          labelKey: '@',
          operator: '@'
        },
        controller: 'skillQueryController',
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