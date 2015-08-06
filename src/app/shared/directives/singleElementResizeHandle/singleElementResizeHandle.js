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

        $element.on('mousedown', function() {
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove (e) {}

        function mouseup() {
          // Destroy listeners 'cuz memory'
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      }
    };
  }]);
