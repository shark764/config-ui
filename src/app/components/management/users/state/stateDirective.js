'use strict';

angular.module('liveopsConfigPanel')
  .directive('userState', function() {
    return {
      templateUrl : 'app/components/management/users/state/state.html',
      scope : {
        ngModel : '=',
        ngDisabled : '='
      }
    };
   });