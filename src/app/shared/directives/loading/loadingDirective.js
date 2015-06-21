'use strict';

angular.module('liveopsConfigPanel')
  .directive('loading', [function() {
    return {
      restrict : 'E',
      transclude: true,
      templateUrl : 'app/shared/directives/loading/loading.html'
    };
  }]);
