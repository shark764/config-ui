'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel')
  .directive('resizeHandle', ['$window', '$document', function($window, $document) {
    return {
      restrict : 'E',
      scope : {
        elementId : '@',
        maxWidth : '@',
        minWidth : '@'
      },

      templateUrl : 'app/shared/directives/resizeHandle/resizeHandle.html',
      link : function(scope, element) {
        //Need non-jqlite object here because jqlite doesn't support offsetLeft, used in mousemove()
        scope.targetElement = document.getElementById(scope.elementId);

        element.on('mousedown', function(event) {
          //Don't initiate resize on right click, because it's annoying
          if (event.button !== 2) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          }
        });

        function mousemove(event) {
          var left = scope.targetElement.offsetLeft;
          var x = event.pageX;
          var newWidth = (x - left);

          if (scope.minWidth && newWidth < scope.minWidth) {
            return;
          }

          // Restrict by maxWidth if it was given,
          // otherwise make sure it doesn't get dragged larger than
          // the page, which would make the handle unreachable.
          if ((scope.maxWidth && newWidth > scope.maxWidth) || newWidth > ($window.innerWidth * 0.95)) {
            return;
          }

          angular.element(scope.targetElement).css('width', newWidth + 'px');
        }

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  }]);
