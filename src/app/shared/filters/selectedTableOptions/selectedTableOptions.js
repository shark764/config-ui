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
        
        for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
          var item = items[itemIndex];
          var showItemInTable = true;
          for(var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            var matchesColumnFilter = true;
            var field = fields[fieldIndex];
            if(!$parse('header.options')(field)) {
              continue;
            }
            
            var lookup = field.lookup ? field.lookup : field.name;
            var options = $filter('invoke')(field.header.options);
            
            for(var optionIndex = 0; optionIndex < options.length; optionIndex++) {
              var option = options[optionIndex];
              nothingChecked = nothingChecked && !option.checked;
              if(!option.checked){
                continue;
              }
              
              var parseValue = $parse(field.header.valuePath ? field.header.valuePath : 'value');
              var value = $filter('invoke')(parseValue(option), option);
              
              if ($filter('matchesField')(item, lookup, value)) {
                matchesColumnFilter = true;
                break;
              } else {
                matchesColumnFilter = false;
              }
            }
            
            showItemInTable = showItemInTable && matchesColumnFilter;
          }
          
          if (showItemInTable){
            filtered.push(item);
          }
        }

        return nothingChecked ? items : filtered;
      };
    }
  ]);
