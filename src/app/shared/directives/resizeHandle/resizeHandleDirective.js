'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel')
  .directive('resizeHandle', ['$window', '$document', '$rootScope', 'lodash', function($window, $document, $rootScope, _) {
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
        scope.sendResizeEvent = _.throttle(function(eventInfo){
            $rootScope.$broadcast('resizehandle:resize', eventInfo);
        }, 500);
        
        element.addClass('resize-pane');

        scope.leftTargetElement = angular.element(document.getElementById(scope.leftElementId));
        scope.rightTargetElement = angular.element(document.getElementById(scope.rightElementId));

        element.on('mousedown', function(event) {
          //Don't initiate resize on right click, because it's annoying
          if (event.button !== 2) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
          }
        });

        function mousemove(event) {
          var leftWidth = scope.leftTargetElement[0].offsetWidth;
          var rightWidth = scope.rightTargetElement[0].offsetWidth;

          var leftBox = scope.leftTargetElement[0].getBoundingClientRect();
          var leftLeft = leftBox.left;

          var x = event.pageX;
          x = x - leftLeft; //Correct for any offset that the panel container(s) have on the screen

          scope.resizeElements(leftWidth, rightWidth, x);
        }

        scope.resizeElements = function(currLeftWidth, currRightWidth, mouseX){
          var newLeftWidth = currLeftWidth - (currLeftWidth - mouseX);

          if (scope.leftMinWidth && newLeftWidth < scope.leftMinWidth) {
            return;
          }

          var newRightWidth = currRightWidth + (currLeftWidth - mouseX);
          if(scope.rightMinWidth && newRightWidth < scope.rightMinWidth){
            return;
          }

          scope.leftTargetElement.css('width', newLeftWidth + 'px');
          scope.rightTargetElement.css('left', newLeftWidth + 'px');
          
          var eventInfo = {
            leftWidth: newLeftWidth,
            rightWidth: newRightWidth
          };
          
          scope.sendResizeEvent(eventInfo);
        };

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  }]);
