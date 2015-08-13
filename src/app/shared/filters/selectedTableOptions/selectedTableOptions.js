'use strict';

angular.module('liveopsConfigPanel')
  .filter('selectedTableOptions', ['$filter',
    function ($filter) {
      return function (items, fields) {
        var filtered = [];
        
        if (angular.isUndefined(items)){
          return;
        }
        
        for(var i = 0; i < items.length; i++) {
          filtered.push(items[i]);
        }

        for(var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
          var field = fields[fieldIndex];
          var options = $filter('invoke')(field.options);
          if(!options) {
            continue;
          }

          for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
            var option = options[optionIndex];
            if(!option.checked){
              continue;
            }

            var value = $filter('invoke')(option.value, option);

            for(var filteredIndex = 0; filteredIndex < filtered.length; ) {
              var item = filtered[filteredIndex];
              if (!$filter('matchesField')(item, field.name, value)) {
                filtered.removeItem(item);
              } else {
                filteredIndex++;
              }
            }
          }
        }

        return filtered;
      };
    }
  ]);
