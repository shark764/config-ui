'use strict';

angular.module('liveopsConfigPanel')
  .directive('tab', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/shared/directives/tab/tab.html',
      require: '^tabset',
      scope: {
        heading: '@'
      },
      link: function(scope, elem, attr, tabsetController) {
        scope.active = !tabsetController.tabs.length;
        tabsetController.tabs.push(scope);
      }
    };
  });