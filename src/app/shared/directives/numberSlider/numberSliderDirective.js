'use strict';

angular.module('liveopsConfigPanel')
  .directive('numberSlider', function(){
    return {
      restrict: 'E',
      scope: {
        value: '=',
        minValue: '@',
        maxValue: '@'
      },
      templateUrl: 'app/shared/directives/numberSlider/numberSlider.html',
      link: function($scope, elem, attr) {

        $scope.minValue = $scope.minValue ? Number($scope.minValue) : null;
        $scope.maxValue = $scope.maxValue ? Number($scope.maxValue) : null;

        $scope.$watch('value', function () {
          if($scope.value){
            if(typeof($scope.value) === 'string'){
              $scope.value = Number($scope.value.replace(/[^0-9]/g, ''));
            }

            if($scope.maxValue !== null && $scope.value > $scope.maxValue){
              $scope.value = $scope.maxValue;
            }

            if($scope.minValue !== null && $scope.value < $scope.minValue){
              $scope.value = $scope.minValue;
            }
          }
        });

        $scope.increment = function () {
          if(!$scope.value){
            $scope.value = 0;
          }

          $scope.value = Number($scope.value) + 1;
        };

        $scope.decrement = function () {
          if(!$scope.value){
            $scope.value = 0;
          }

          $scope.value = Number($scope.value) - 1;
        };

      }
    };
  });
