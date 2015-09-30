'use strict';

angular.module('liveopsConfigPanel')
  .service('cacheAddInterceptor', ['queryCache',
    function (queryCache) {
      this.response = function (response) {
        var proto = Object.getPrototypeOf(response.resource);
        var keyName = response.resource.cacheKey ? response.resource.cacheKey() : proto.resourceName;
        
        if (!queryCache.get(keyName)) {
          queryCache.put(keyName, []);
        }
        
        queryCache.get(keyName).push(response.resource);

        return response.resource;
      };
    }
  ]);
