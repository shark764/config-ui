'use strict';

angular.module('liveopsConfigPanel')
  .filter('hasNew', [function() {
    return function(resources) {
      if(!resources) {
        return;
      }
      
      for(var index = 0; index < resources.length; index++) {
        var resource = resources[index];
        if(resource.isNew && resource.isNew()) {
          return true;
        }
      }
    };
  }]);