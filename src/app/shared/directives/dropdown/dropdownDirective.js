'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', ['$document', function($document) {
    return {
      scope : {
        items : '=',
        label : '@'
      },
      templateUrl : 'app/shared/directives/dropdown/dropdown.html',
      link : function(scope, element) {
        scope.showDrop = false;

        //Only bother listening for the click event when a dropdown is open
        scope.$watch(function() {return scope.showDrop;}, function(newValue, oldValue) {
          if (newValue && !oldValue) {
            $document.on('click', onClick);
          }
        });

        function onClick(event){
          //Hide the dropdown when user clicks outside of it
          var clickedInDropdown = element.find(event.target).length > 0;
          if (clickedInDropdown) {
            return;
          }

          scope.$apply(function() {
            scope.showDrop = false;
          });

          $document.off('click', onClick);
        }

        //Automatically uncheck other filters when "All" is selected
        scope.$watch(function(scope) {return scope.items.all.checked;},
          function(newValue, oldValue) {
            if (newValue && !oldValue) {
              angular.forEach(scope.items.filters, function(state) {
                state.checked = false;
              });
            }
          }
        );

        //Automatically uncheck "All" when another filter is selected
        angular.forEach(scope.items.filters, function(state) {
          scope.$watch(function() {
            return state.checked;
          }, function(newValue, oldValue) {
            if (newValue && !oldValue) {
              scope.items.all.checked = false;
            }
          });
        });
      }
    };
   }])
;
