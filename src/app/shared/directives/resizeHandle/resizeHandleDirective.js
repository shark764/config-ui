'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel')
  .directive('resizeHandle', ['$window', '$document', function($window, $document) {
    return {
      restrict : 'E',
      scope : {
        leftElementId : '@',
        rightElementId : '@',
        rightMinWidth: '@',
        leftMinWidth : '@'
      },

      templateUrl : 'app/shared/directives/resizeHandle/resizeHandle.html',
      link : function(scope, element) {
        //Need non-jqlite object here because jqlite doesn't support offsetLeft, used in mousemove()
        scope.leftTargetElement = document.getElementById(scope.leftElementId);
        scope.rightTargetElement = document.getElementById(scope.rightElementId);

        element.on('mousedown', function(event) {
          //Don't initiate resize on right click, because it's annoying
          if (event.button !== 2) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          }
        });

        function mousemove(event) {
          var left = scope.leftTargetElement.offsetWidth;
          var right = scope.rightTargetElement.offsetWidth;

          var x = event.pageX;

          var newLeftWidth = left - (left - x),
              newRightWidth = right + (left - x);

          console.log();

          if (scope.leftMinWidth && newLeftWidth < scope.leftMinWidth) {
            return;
          }

          if(scope.rightMinWidth && newRightWidth < scope.rightMinWidth){
            return;
          }

          scope.previousRight = right;

          angular.element(scope.leftTargetElement).css('width', newLeftWidth + 'px');
          angular.element(scope.rightTargetElement).css('left', newLeftWidth + 'px');
        }

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  }]);
