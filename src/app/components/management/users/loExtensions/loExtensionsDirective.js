'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', [
    function () {
      return {
        restrict: 'E',
        scope: {
          tenantUser: '=',
          ngDisabled: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensions.html',
        controller: 'LoExtensionsController'
      };
    }
  ]);
