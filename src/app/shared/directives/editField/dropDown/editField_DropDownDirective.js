'use strict';

angular.module('liveopsConfigPanel')
  .directive('editFieldDropDown', ['UserService', function (UserService) {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/shared/directives/editField/dropDown/editField_DropDown.html',
      scope: {
        field: '=',
        save: '=',
        objectId: '=',
        defaultText: '@',
        name: '@',
        label: '@',
        placeholder: '@'
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
  