'use strict';

angular.module('liveopsConfigPanel')
  .directive('tabset', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/shared/directives/tab/tabset.html',
      bindToController: true,
      controllerAs: 'tabset',
      controller: function() {
        var self = this;
        self.tabs = [];
      }
    };
  });