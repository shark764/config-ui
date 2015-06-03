'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@'
      },
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope) {
        scope.optionClick = function(func){
          scope.showDrop = false;
          func();
        };
      }
    };
   }])
;
