'use strict';

angular.module('liveopsConfigPanel')
  .directive('editField', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/editField/input/editField_input.html',
      scope: {
        ngModel: '=',
        save: '=',
        objectId: '=',
        name: '@',
        label: '@',
        type: '@',
        placeholder: '@'
      },
      controller: 'EditFieldController'
    };
  });
