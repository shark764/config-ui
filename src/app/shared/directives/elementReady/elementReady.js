'use strict';

// this directive detects when a page is 100% loaded
angular.module('liveopsConfigPanel.shared.directives')
  .directive('elementReady', function( $parse, $timeout ) {
    return {
      restrict: 'A',
      link: function($scope, elem, attrs) {
        elem.ready(function() {
          $timeout(function () {
            $scope.$apply(function() {
              var func = $parse(attrs.elementReady);
              func($scope);
            });
          });
        });
      }
    };
  });