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

      var findFields = function (field, item) {
        var itemStrings = [];
        var fieldGetter = $parse(field.path);
        var fieldValue = fieldGetter(item);

        if (typeof (fieldValue) === 'string') {
          itemStrings = [fieldValue];
        } else if (typeof (fieldValue) === 'object') {
          angular.forEach(fieldGetter(item), function (result) {
            if ('inner' in field) {
              itemStrings = itemStrings.concat(findFields(field.inner, result));
            } else {
              itemStrings = [result];
            }
          });
        }
        return itemStrings;
      }

      var filtered = [];
      angular.forEach(items, function (item) {

        var wildCardQuery = new RegExp(regExpReplace(query), 'i');
        var itemString = '';

        angular.forEach(fields, function (field) {
          if (typeof (field) === 'string') {
            itemString += item[field] + ' ';
          } else if (typeof (field) === 'object') {
            itemString += findFields(field, item).join(' ');
          }
        });

        if (wildCardQuery.test(itemString)) {
          filtered.push(item);
        }
      });

      return filtered;
    };
  }]);