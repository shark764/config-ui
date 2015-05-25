'use strict';

angular.module('liveopsConfigPanel')
  .directive('editField', ['UserService', function (UserService) {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/editField/editField.html',
      scope: {
        field: '=',
        save: '=',
        objectId: '=',
        name: '@',
        label: '@',
        type: '@'
      },
      link: function(scope, elem, attr) {
        scope.saveHandler = function(save, key, value, objectId) {
          var saveField = {};
          saveField[key] = value;
          saveField['updatedBy'] = '09478090-02e7-11e5-b2a6-2da9f0004fdd';
          
          save(objectId, saveField).then(function(){
            scope.edit = false;
          });
        }
      }
    };
  }]);
  