'use strict';

angular.module('liveopsConfigPanel')
  .directive('toggle', function() {
    return {
      templateUrl : 'app/shared/directives/toggle/toggle.html',
      scope : {
        ngModel : '=',
        ngDisabled : '='
      }
    };
   });