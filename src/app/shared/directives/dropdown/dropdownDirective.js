'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@',
        valuePath: '@',
        displayPath: '@',
        collapseIcon: '@',
        expandIcon: '@',
        orderBy: '@',
        hovering: '=?',
        hoverTracker: '=?',
        showOnHover: '='
      },
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
      controller : 'DropdownController',
      link : function(scope, element, attrs, controller) {
        scope.valuePath = scope.valuePath ? scope.valuePath : 'value';
        scope.displayPath = scope.displayPath ? scope.displayPath : 'label';
        
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

        if (!scope.orderBy){
          scope.orderBy = 'label';
        }

        scope.optionClick = function(func){
          scope.showDrop = false;
          scope.hovering = false;
          func();
        };

        if(! scope.collapseIcon){
          scope.collapseIcon = 'fa fa-caret-up';
        }

        if (! scope.expandIcon){
          scope.expandIcon = 'fa fa-caret-down';
        }

        scope.mouseIn = function(){
          if (scope.hovering || scope.showOnHover){
            scope.showDrop = true;
            scope.clearOtherHovers();
          }
        };

        scope.dropClick = function(){
          scope.showDrop = ! scope.showDrop;
          scope.hovering = ! scope.hovering;
        };
      }
    };
   }])
;
