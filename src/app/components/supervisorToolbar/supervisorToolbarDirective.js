'use strict';
angular.module('liveopsConfigPanel')
  .directive('supervisorToolbar',
    function () {
      return {
        restrict: 'E',
        controller: 'supervisorToolbarController as sdklc',
        templateUrl: 'app/components/supervisorToolbar/supervisorToolbar.html',
      };
    }
  );
