'use strict';

angular.module('liveopsConfigPanel')
  .filter('selectedTableOptions', ['selectedOptionsFilter',
    function (selectedOptionsFilter) {
      return function (items, fields) {
        var filtered = items;

        angular.forEach(fields, function(field){
          angular.forEach(field.options, function(option){

            // not ideal; this makes assumptions about how lists are going to be
            // used (ie. no items selected = all selected) which may not be useful
            // @TODO: find a better way to handle this entire flow

            // if any options are checked, we need to do a filter;
            // assume non-checked = all selected; therefor no filter required
            if(option.checked){
              filtered = selectedOptionsFilter(items, field);
              return;
            }
          });
        });

        return filtered;
      };
    }
  ]);
