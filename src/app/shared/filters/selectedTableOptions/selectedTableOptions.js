'use strict';

angular.module('liveopsConfigPanel')
  .filter('selectedTableOptions', ['$parse', '$filter',
    function ($parse, $filter) {
      return function (items, fields) {
        var filtered = [];
        
        if (angular.isUndefined(items)){
          return filtered;
        }
        
        var nothingChecked = true;
        for(var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
          var field = fields[fieldIndex];
          if(!$parse('header.options')(field)) {
            continue;
          }
          
          var options = $filter('invoke')(field.header.options);
          
          for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
            var option = options[optionIndex];
            nothingChecked = nothingChecked && !option.checked;
            if(!option.checked){
              continue;
            }
            
            var parseValue = $parse(field.header.valuePath ? field.header.valuePath : 'value');
            var value = $filter('invoke')(parseValue(option), option);
            
            for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
              var item = items[itemIndex];
              var lookup = field.lookup ? field.lookup : field.name;
              if ($filter('matchesField')(item, lookup, value)) {
                filtered.push(item);
              }
            }
          }
        }

        return nothingChecked ? items : filtered;
      };
    }
  ]);
