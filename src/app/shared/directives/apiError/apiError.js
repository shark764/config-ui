'use strict';

angular.module('liveopsConfigPanel')
  .directive('apiError', function(){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, elem, attr, ctrl){
        ctrl.$parsers.unshift(function(value){
          ctrl.$setValidity('api', true);
          return value;
        });
      }
    };
  });