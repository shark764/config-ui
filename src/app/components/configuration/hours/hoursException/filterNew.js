'use strict';

angular.module('liveopsConfigPanel')
  .filter('newResource', [function() {
    return function(resources, inverse) {
      var returnList = [];
      if(!resources) {
        return;
      }
      
      for(var index = 0; index < resources.length; index++) {
        var resource = resources[index];
        if(resource.isNew) {
          resource.$originalIndex = index;
          if((!inverse && resource.isNew()) || (inverse && !resource.isNew())) {
            returnList.push(resource);
          }
        }
      }
      
      return returnList;
    };
  }]);