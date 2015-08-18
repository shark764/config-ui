'use strict';

angular.module('liveopsConfigPanel')
  .service('cacheRemoveInterceptor', ['queryCache',
    function (queryCache) {
      this.response = function (response) {
        var proto = Object.getPrototypeOf(response.resource);

        if(queryCache.get(proto.resourceName)) {
          queryCache.get(proto.resourceName).removeItem(response.resource);
        }

        return response.resource;
      };
    }
  ]);
