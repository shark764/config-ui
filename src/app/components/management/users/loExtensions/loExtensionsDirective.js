'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', [
    function() {
      return {
        restrict: 'E',
        require: '^form',
        scope: {
          tenantUser: '=',
          hasTwilioIntegration: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensions.html',
        controller: 'loExtensionsController as lec',
        link: function($scope, element, attrs, ngFormController){
          $scope.form = ngFormController;
        }
      };
    }
  ]);
