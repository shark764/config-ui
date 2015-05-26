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
      link: function (scope) {
        scope.saveHandler = function () {
          scope.$emit('editField:save', {
            objectId: scope.objectId,
            fieldName: scope.name,
            fieldValue: scope.ngModel
          });
        };

        scope.$on('userList:' + scope.name + ':save', function () {
          scope.edit = false;
        });

        scope.$on('userList:' + scope.name + ':save:error', function () {
        });
      }
    };
  });