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

        self.select = function(selectedTab) {
          angular.forEach(self.tabs, function(tab) {
            if (tab.active && tab !== selectedTab) {
              tab.active = false;
            }
          });

          selectedTab.active = true;
        };
      }
    };
  });