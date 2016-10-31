'use strict';

angular.module('liveopsConfigPanel')
  .filter('greaterOrLessThanFilter', function () {
    return function(items, property, comparison, value, unit) {
      if (!items || !comparison || parseInt(value) !== value) {
        return items;
      } else {
        var filtered = [];
        var unitMultiplier = 1;
        if (unit) {
          unitMultiplier = unit;
        }
        if (comparison == '>') {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[property] >= value * unitMultiplier) {
              filtered.push(item);
            }
          }
        } else if (comparison == '<') {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[property] <= value * unitMultiplier) {
              filtered.push(item);
            }
          }
        } else {
          console.error('Invalid comparison value: ', comparison);
          return items;
        }
        return filtered;
      }
    }
  });
