'use strict';

angular.module('liveopsConfigPanel')
  .service('cacheAddInterceptor', ['queryCache',
    function (queryCache) {
      this.response = function (response) {
        var proto = Object.getPrototypeOf(response.resource);

        if(!queryCache.get(proto.resourceName)) {
          queryCache.put(proto.resourceName, []);
        }
        
        queryCache.get(proto.resourceName).push(response.resource);

        return response.resource;
      };
    }
  ]);
