'use strict';

angular.module('liveopsConfigPanel')
  .directive('toggle', ['$document', function($document) {
    return {

      templateUrl : 'app/shared/directives/toggle/toggle.html',
      require: "ngModel",
      scope : {
        ngModel : "="
      },
      link : function(scope, element, attrs, ngModel) {

        }
        
    };
   }])
;