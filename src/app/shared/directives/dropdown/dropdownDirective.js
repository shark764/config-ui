'use strict';

angular.module('liveopsConfigPanel')
  .directive('dropdown', ['$document', function($document) {
    return {
    scope : {
      items : '=',
      label : '@',
      changeFunction : '=changefunction'
    },
    templateUrl : 'app/shared/directives/dropdown/dropdown.html',
    link : function(scope, element) {
      scope.showDrop = false;
      
      $document.bind('click', function(event) {
        var clickedInDropdown = element.find(event.target).length > 0;
        if (clickedInDropdown) {
          return;
        }
        
        scope.$apply(function() {
          scope.showDrop = false;
        });
      });
      
      scope.$watch(function(scope) {return scope.items.all.checked;}, 
        function(newValue, oldValue) {
          if (newValue && !oldValue) {
            angular.forEach(scope.items.filters, function(state) {
              state.checked = false;
            });
          }
        }
      );
      
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
