'use strict';

angular.module('liveopsConfigPanel')
  .directive('hoursExceptions', [
    function () {
      return {
        restrict: 'E',
        scope: {
          hours: '=',
          form: '='
        },
        controller: 'hoursExceptionController as hec',
        templateUrl: 'app/components/configuration/hours/hoursException/hoursException.html'
      };
    }
  ]);
  