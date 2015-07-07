'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@',
        collapseIcon: '@',
        expandIcon: '@',
        orderBy: '@'
      },
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope, element) {
        element.parent().css('overflow', 'visible');
        
        if (!scope.orderBy){
          scope.orderBy = 'label';
        }
        
        scope.optionClick = function(func){
          scope.showDrop = false;
          func();
        };
        
        if(! scope.collapseIcon){
          scope.collapseIcon = 'fa fa-caret-up';
        }
        
        if (! scope.expandIcon){
          scope.expandIcon = 'fa fa-caret-down';
        }
      }
    };
   }])
;
