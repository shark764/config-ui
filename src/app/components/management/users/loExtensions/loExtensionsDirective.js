'use strict';

angular.module('liveopsConfigPanel')
  .directive('loExtensions', [
    function() {
      return {
        restrict: 'E',
        require: '^form',
        scope: {
          tenantUser: '=',
          ngDisabled: '=',
          dontSaveRoleId: '='
        },
        templateUrl: 'app/components/management/users/loExtensions/loExtensions.html',
        controller: 'loExtensionsController as lec',
        link: function($scope, element, attrs, ngFormController){
          $scope.form = ngFormController;
          $scope.isDisabled = $scope.ngDisabled;
        }
      };
    }
  ]);
