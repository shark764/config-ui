'use strict';

angular.module('liveopsConfigPanel')
  .directive('toggle', function() {
    return {
      templateUrl : 'app/shared/directives/toggle/toggle.html',
      scope : {
        ngModel : '=',
        ngDisabled : '=',
        trueValue: '@',
        falseValue: '@'
      },
      link: function ($scope) {
        if (typeof $scope.trueValue === 'undefined'){
          $scope.trueValue = true;
        }

        if(typeof $scope.falseValue === 'undefined') {
          $scope.falseValue = false;
        }
      }
    };
   });