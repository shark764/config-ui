'use strict';

angular.module('liveopsConfigPanel')
  .directive('toggle', ['$document', function($document) {
    return {
      templateUrl : 'app/shared/directives/toggle/toggle.html',
      scope : {
        ngModel : "="
      }
    };
   }])
;