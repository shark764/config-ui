'use strict';

angular.module('liveopsConfigPanel')
.filter('search', function() {
    return function (items, fields, query) {
      if (! fields || !query){
        return items;
      }
      
      function regExpReplace(string) {
        string.replace(/([.+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        return string.replace(/([*])/g, '.*');
      }

      var filtered = [];
      angular.forEach(items, function (item) {

        var wildCardQuery = new RegExp(regExpReplace(query), 'i');
        var itemString = '';
        
        angular.forEach(fields, function (field) {
          itemString += item[field];
          itemString+= ' ';
        });
        
        if (wildCardQuery.test(itemString)){
          filtered.push(item);
        }
      });
      
      return filtered;
    };
  });