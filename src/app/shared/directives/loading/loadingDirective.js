'use strict';

angular.module('liveopsConfigPanel')
  .directive('loading', [function() {
    return {
      restrict : 'E',
      templateUrl : 'app/shared/directives/loading/loading.html'
    };
  }]);
