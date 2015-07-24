'use strict';

angular.module('liveopsConfigPanel')
  .directive('userToggle', function() {
    return {
      templateUrl : 'app/components/management/users/toggle/toggle.html',
      scope : {
        ngModel : '=',
        ngDisabled : '='
      }
    };
   });