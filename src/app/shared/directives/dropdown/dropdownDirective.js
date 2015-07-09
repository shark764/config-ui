'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@',
        collapseIcon: '@',
        expandIcon: '@',
        orderBy: '@',
        hovering: '=?',
        hoverTracker: '=?'
      },
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope, element, attrs, controller) {
        if (typeof scope.hovering !== 'undefined' && scope.hoverTracker){
          scope.hoverTracker.push(controller);
        }
        
        scope.clearOtherHovers = function(){
          angular.forEach(scope.hoverTracker, function(hoverCtrl){
            if (hoverCtrl !== controller){
              hoverCtrl.setShowDrop(false);
            }
          });
        };
        
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
        
        scope.mouseIn = function(){
          if (scope.hovering){
            scope.showDrop = true;
            scope.clearOtherHovers();
          }
        };
        
        scope.dropClick = function(){
          scope.showDrop = ! scope.showDrop
          scope.hovering = ! scope.hovering;
        };
      }
    };
   }])
;
