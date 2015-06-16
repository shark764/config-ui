'use strict';

angular.module('liveopsConfigPanel')
  .filter('search', ['$parse', function ($parse) {
    return function (items, fields, query) {
      if (!fields || !query) {
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
          if (typeof (field) === 'string') {
            itemString += item[field] + ' ';
          } else if (typeof (field) === 'object') {
            var fieldGetter = $parse(field.path);
            angular.forEach(fieldGetter(item), function(result){
              if('name' in field){
                itemString += result[field.name] + ' ';
              } else {
                itemString += result + ' ';
              }
            });
          }
        });

        if (wildCardQuery.test(itemString)) {
          filtered.push(item);
        }
      });

      return filtered;
    };
  }]);