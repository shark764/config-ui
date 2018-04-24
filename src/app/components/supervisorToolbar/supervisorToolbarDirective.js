'use strict';
angular.module('liveopsConfigPanel')
  .directive('supervisorToolbar', ['Session',
    function (Session) {
      return {
        restrict: 'E',
        controller: 'supervisorToolbarController as sdklc',
        templateUrl: 'app/components/supervisorToolbar/supervisorToolbar.html',
      };
    }
  ]);
