'use strict';

angular.module('liveopsConfigPanel')
  .directive('listEditor', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/listEditor/listEditor.html',
      controller: 'listEditorController as lec',
      scope: {
        dispositionList: '=ngModel',
        detailsForm: '=form',
        readOnly: '=',
        shared: '=',
        type: '@'
      },
      link: function() {
      }
    };
  });
