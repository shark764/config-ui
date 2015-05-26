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
      link: function(scope) {
        scope.saveHandler = function() {
          scope.$emit('editField:save', {
            objectId: scope.objectId,
            fieldName: scope.name,
            fieldValue: scope.ngModel
          });
        };

        scope.$on('userList:' + scope.name + ':save', function() {
          scope.edit = false;
        });

        scope.$on('userList:' + scope.name + ':save:error', function() {
        });
      }
    };
  });
