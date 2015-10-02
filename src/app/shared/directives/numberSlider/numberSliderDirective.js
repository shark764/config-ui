'use strict';

angular.module('liveopsConfigPanel')
  .directive('numberSlider', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      scope: {
        value: '=',
        minValue: '@',
        maxValue: '@',
        hasHandles: '=',
        placeholder: '@',
        ngChanged: '&'
      },
      templateUrl: 'app/shared/directives/numberSlider/numberSlider.html',
      link: function($scope, element) {

        $scope.minValue = $scope.minValue ? Number($scope.minValue) : null;
        $scope.maxValue = $scope.maxValue ? Number($scope.maxValue) : null;
        
        $scope.$watch('value', function () {
          if($scope.value){
            if(typeof($scope.value) === 'string'){
              $scope.value = Number($scope.value.replace(/[^0-9\\.\\-]/g, ''));
            }

            if($scope.maxValue !== null && $scope.value > $scope.maxValue){
              $scope.value = $scope.maxValue;
            }

            if($scope.minValue !== null && $scope.value < $scope.minValue){
              $scope.value = $scope.minValue;
            }
            
            $scope.ngChanged($scope.value);
          }
        });

        $scope.increment = function () {
          if(! $scope.value){
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.ngChanged();
            return;
          }
          
          if($scope.maxValue === null || $scope.value < $scope.maxValue){
            $scope.value = Number($scope.value) + 1;
            $scope.ngChanged();
          }
        };

        $scope.decrement = function () {
          if(!$scope.value){
            $scope.value = $scope.minValue ? $scope.minValue : 0;
            $scope.ngChanged();
            return;
          }

          if($scope.minValue === null || $scope.value > $scope.minValue){
            $scope.value = Number($scope.value) - 1;
            $scope.ngChanged();
          }
        };
        
        element.find('input').bind('keydown keypress', function(event){
          if(event.which === 40){ //Down arrow key
            $timeout($scope.decrement);
            event.preventDefault();
          } else if(event.which === 38){ //Up arrow key
            $timeout($scope.increment);
            event.preventDefault();
          }
        });
      }
    };
  }]);
