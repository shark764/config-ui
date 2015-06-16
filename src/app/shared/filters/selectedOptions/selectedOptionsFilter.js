'use strict';

angular.module('liveopsConfigPanel')
  .filter('selectedOptions', function () {
    return function (items, field) {
      var filtered = [];
      angular.forEach(items, function (item) {
        angular.forEach(field.options, function (option) {

          if (option.checked && option.value === item[field.name]) {
            return filtered.push(item);
          }
        });
      });

      return filtered;
    };
  });
