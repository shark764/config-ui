'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel')
  .directive('resizeHandle', ['$window', '$document', '$rootScope', 'lodash', function($window, $document, $rootScope, _) {
    return {
      restrict : 'E',
      scope : {
        leftElementId : '@',
        rightElementId : '@'
      },

      templateUrl : 'app/shared/directives/resizeHandle/resizeHandle.html',
      link : function(scope, element) {
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
          // TODO Fix this fo real.. temprorary test fix

          var parentWidth = 0;

          if(scope.leftTargetElement.parent){
            var parent = scope.leftTargetElement.parent();
            parentWidth = parent[0].offsetWidth;
          }

          var delta = currLeftWidth - mouseX,
              newLeftWidth = currLeftWidth - delta,
              newRightWidth = currRightWidth + delta,
              leftMinWidth = parseInt(scope.leftTargetElement.css('min-width')),
              rightMinWidth = parseInt(scope.rightTargetElement.css('min-width')),
              leftMaxWidth = parentWidth - currRightWidth,
              rightMaxWidth = parentWidth - currLeftWidth;

          if(newRightWidth < rightMinWidth || newLeftWidth < leftMinWidth){
            return;
          }

          scope.leftTargetElement.css('width', newLeftWidth + 'px');
          scope.rightTargetElement.css('width', newRightWidth + 'px');

          var eventInfo = {
            leftWidth: newLeftWidth,
            rightWidth: newRightWidth
          };

          scope.sendResizeEvent(eventInfo);
          scope.applyClasses(eventInfo, scope.leftTargetElement, 'leftWidth');
          scope.applyClasses(eventInfo, scope.rightTargetElement, 'rightWidth');
        };

        scope.sendResizeEvent = _.throttle(function(eventInfo){
          $rootScope.$broadcast('resizehandle:resize', eventInfo);
        }, 500);

        scope.applyClasses = function(info, element, fieldName){
          if (info[fieldName] > 700){
            element.addClass('two-col');
          } else {
            element.removeClass('two-col');
          }

          if (info[fieldName] < 450){
            element.addClass('compact-view');
          } else {
            element.removeClass('compact-view');
          }
        };

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  }]);
