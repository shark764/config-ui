'use strict';

angular.module('liveopsConfigPanel')
.filter('find', function() {
    return function (items, fields) {
      if (! fields){
        return items;
      }
      
     for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var match = false;
        
        for (var key in fields) {
          if (fields.hasOwnProperty(key)) {
            if (item[key] == fields[key]){
              match = true;
            } else {
              match = false;
              break;
            }
          }
        }
        
        if (match){
          return item;
        }
      };
      
      return undefined;
    };
  });