'use strict';

angular.module('liveopsConfigPanel')
  .directive('numberSlider', function(){
    return {
      restrict: 'E',
      scope: {
        value: '='
      },
      templateUrl: 'app/shared/directives/numberSlider/numberSlider.html',
      link: function($scope, elem, attr) {

        $scope.$watch('value', function () {
          if($scope.value){
            $scope.value = $scope.value.replace(/[^0-9]/g, '');
          }
        });

      }
    };
  });