'use strict';

angular.module('liveopsConfigPanel')
  .directive('navbar', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: 'NavbarController'
    };
  });