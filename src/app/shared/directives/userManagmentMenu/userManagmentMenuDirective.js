'use strict';

angular.module('liveopsConfigPanel')
  .directive('userManagmentMenu', function () {
      return {
        restrict: 'E',
        scope: {
          collapsed: '='
        },
        templateUrl: 'app/shared/directives/userManagmentMenu/userManagmentMenu.html'
      };
  });
