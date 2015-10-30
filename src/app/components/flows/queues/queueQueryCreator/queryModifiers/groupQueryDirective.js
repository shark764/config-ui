'use strict';

angular.module('liveopsConfigPanel')
  .directive('groupQuery', ['jsedn',
    function (jsedn) {
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/flows/queues/queueQueryCreator/queryModifiers/templates/readonlyGroupQuery.html',
        require: ['^readonlyQuery', 'groupQuery'],
        scope: {
          query: '=',
          labelKey: '@',
          operator: '@'
        },
        controller: 'groupQueryController',
        link: function($scope, element, attr, controllers) {
          $scope.$watch('query', function (newQuery) {
            if (!newQuery) {
              return;
            }
            
            $scope.parentMap = jsedn.parse($scope.query);
            $scope.operands = controllers[1].parseOperands();
            
            var readonlyQueryController = controllers[0];
            readonlyQueryController.setDisplay($scope.operands);
          });
        }
      };
    }
  ]);