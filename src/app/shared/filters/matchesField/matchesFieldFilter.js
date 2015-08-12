'use strict';

angular.module('liveopsConfigPanel')
  //Return the item if the given field matches the given value
  //If no match, returns undefined.
  //Allows matching/search through arrays; use colons in fieldPath to separate layers
  //e.g. "skills:id" will search an object like {name: "name", skills: [{id: "id"}, {id: "other"}]}
  .filter('matchesField', [function () {
    return function (item, fieldPath, value) {
      var findFields = function (item, fieldPath, value) {
        if (angular.isUndefined(item) || angular.isUndefined(fieldPath) || fieldPath === '' || angular.isUndefined(value)){
          return;
        }
        
        var firstColonIndex = fieldPath.indexOf(':');
        if (firstColonIndex > -1){
          var currentPath = fieldPath.substring(0, firstColonIndex);
          var remainingPath = fieldPath.substring(firstColonIndex + 1);
          
          return findFields(item[currentPath], remainingPath, value) ? item : undefined;
        }
        
        if (angular.isArray(item)) {
          for (var i = 0; i < item.length; i++){
            if (item[i][fieldPath] === value){
              return item;
            }
          }
        } else {
          if (item[fieldPath] === value) {
            return item;
          }
        }
      };

      return findFields(item, fieldPath, value);
    };
  }]);