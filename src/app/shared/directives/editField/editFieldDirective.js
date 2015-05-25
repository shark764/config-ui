'use strict';

angular.module('liveopsConfigPanel')
  .directive('editField', ['UserService', function (UserService) {
    return {
      // restrict: 'E',
      // transclude: true,
      templateUrl: 'app/shared/directives/editField/editField.html',
      scope: {
        field: '=',
        save: '=',
        label: '@',
        type: '@'
      },
      link: function(scope, elem, attr) {
        var self = this;
        
        scope.edit = function(field) {
          field.edit = true;
        };
        
        scope.saveHandler = function(save, field) {
          var saveField = {};
          saveField[field.name] = field.value;
          saveField['updatedBy'] = '09478090-02e7-11e5-b2a6-2da9f0004fdd';
          
          save(field.userId, saveField).then(function(){
            field.edit = false;
          });
        }
      }
    };
  }]);
  