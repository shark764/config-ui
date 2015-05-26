'use strict';

angular.module('liveopsConfigPanel')
  .directive('editFieldDropDown', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/shared/directives/editField/dropDown/editField_DropDown.html',
      scope: {
        ngModel: '=',
        save: '=',
        objectId: '=',
        defaultText: '@',
        name: '@',
        label: '@',
        placeholder: '@'
      },
      controller: 'EditFieldController'
    };
  });