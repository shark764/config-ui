'use strict';

angular.module('liveopsConfigPanel')
  .directive('filterDropdown', [function() {
    return {
      scope : {
        items : '=',
        label : '@'
      },
      templateUrl : 'app/shared/directives/dropdown/filterDropdown.html',
      controller: 'DropdownController',
      link : function(scope) {
        //Automatically uncheck other filters when "All" is selected
        if (scope.items.all){
          scope.$watch(function(scope) {return scope.items.all.checked;},
            function(newValue, oldValue) {
              if (newValue && !oldValue) {
                angular.forEach(scope.items.filters, function(state) {
                  state.checked = false;
                });
              }
            }
          );
        }

        //Automatically uncheck "All" when another filter is selected
        if(scope.items.all){
          angular.forEach(scope.items.filters, function(filter) {
            scope.$watch(function() {
              return filter.checked;
            }, function(newValue, oldValue) {
              if (newValue && !oldValue) {
                scope.items.all.checked = false;
              }
            });
          });
        }
      }
    };
   }])
;
