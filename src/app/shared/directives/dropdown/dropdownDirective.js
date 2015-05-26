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
      }
    };
   }])
;
