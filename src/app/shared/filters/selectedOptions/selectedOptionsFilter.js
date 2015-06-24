'use strict';

angular.module('liveopsConfigPanel')
  .filter('selectedOptions', ['$parse', function ($parse) {
    return function (items, field) {
      var filtered = [];
      angular.forEach(items, function (item) {
        angular.forEach(field.options, function (option) {
          
          var find = $parse(field.name);
          if (option.checked && option.value === find(item)) {
            return filtered.push(item);
          }
        });
      });

      return filtered;
    };
  }]);
