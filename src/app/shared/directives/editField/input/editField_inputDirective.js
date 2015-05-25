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
        scope.saveHandler = function(save, key, value, objectId) {
          var saveField = {};
          saveField[key] = value;
          saveField.updatedBy = '09478090-02e7-11e5-b2a6-2da9f0004fdd';
          
          save(objectId, saveField).then(function(){
            scope.edit = false;
          });
        };
      }
    };
  });
  