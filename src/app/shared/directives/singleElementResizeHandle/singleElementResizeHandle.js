'use strict';
/*jslint browser:true */

angular.module('liveopsConfigPanel')
  .directive('singleElementResizeHandle', ['$window', '$document', '$rootScope', 'lodash', function($window, $document, $rootScope, _) {
    return {
      restrict : 'E',
      scope : {
        elementId : '@',
        minWidth: '@',
        maxWidth: '@'
      },
      templateUrl : 'app/shared/directives/singleElementResizeHandle/singleElementResizeHandle.html',
      link : function($scope, $element) {
        $scope.targetElement = angular.element(document.getElementById($scope.elementId));

        $element.on('mousedown', function() {
          if (event.button !== 2) {
            event.preventDefault();
            $document.on('mousemove', mousemove);
            $document.on('mouseup', $scope.mouseup);
          }
        });

        function mousemove(event) {
          var elementWidth = $scope.targetElement[0].offsetWidth;
          var pageX = event.pageX;
          var windowWidth = $window.innerWidth;

          $scope.resizeElement(elementWidth, windowWidth, pageX);
        }

        $scope.applyClasses = function(width, element){
          if (width > 700){
            element.addClass('two-col');
          } else {
            element.removeClass('two-col');
          }

          if (width < 450){
            element.addClass('compact-view');
          } else {
            element.removeClass('compact-view');
          }
        };

        $scope.mouseup = function() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', $scope.mouseup);
        };

        $scope.sendResizeEvent = _.throttle(function(eventInfo) {
          $rootScope.$broadcast('resizehandle:resize', eventInfo);
        }, 500);

        $scope.resizeElement = function(elementWidth, windowWidth, pageX) {
          var newElementWidth = windowWidth - pageX;

          if (newElementWidth < $scope.minWidth || newElementWidth > $scope.maxWidth) {
            return;
          }

          $scope.targetElement.css('width', newElementWidth + 'px');
          $scope.sendResizeEvent(newElementWidth);
          $scope.applyClasses(newElementWidth, $scope.targetElement);
        };
      }
    };
  }]);
