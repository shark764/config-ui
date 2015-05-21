'use strict';

angular.module('liveopsConfigPanel')
.directive('resizeHandle', function() {
    return {
      restrict : 'E',
      scope : {
        elementId : '@'
      }, 
        
       templateUrl: 'app/shared/directives/resizeHandle/resizeHandle.html'
    };
  })
  .directive('resizable', function($document, $window) {
    return function(scope, element, attrs) {
        element.on('mousedown', function(event) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            element = angular.element(document.querySelector( '#' + attrs.elementId ) );
            
            var elem = document.getElementById(attrs.elementId);
            var left = elem.offsetLeft;
            var x = event.pageX;
            var newWidth = (x - left)
            
            if (attrs.minWidth && newWidth < attrs.minWidth) {
              return;
            }
            
            if ((attrs.maxWidth && newWidth > attrs.maxWidth) || newWidth > ($window.innerWidth * 0.95)) {
              return;
            }
            
            element.css('width', newWidth + 'px');
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    };
  })