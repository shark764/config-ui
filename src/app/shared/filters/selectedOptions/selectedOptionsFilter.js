'use strict';

angular.module('liveopsConfigPanel')
  .filter('selectedOptions', ['$filter', function ($filter) {
    return function (items, field) {
      var filtered = [];
      angular.forEach(items, function (item) {
        var wasAdded = false;
        angular.forEach(field.options, function (option) {
          if (!wasAdded && option.checked && $filter('matchesField')(item, field.name, option.value)) {
            filtered.push(item);
            wasAdded = true;
          }
        });
      });

      return filtered;
    };
  }]);
