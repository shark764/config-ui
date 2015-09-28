'use strict';

angular.module('liveopsConfigPanel')
  .service('userSkillCacheRemoveInterceptor', ['queryCache', 'filterFilter',
    function (queryCache, filterFilter) {
      this.response = function (response) {
        var proto = Object.getPrototypeOf(response.resource);
        var keyName = response.resource.cacheKey ? response.resource.cacheKey() : proto.resourceName;

        if(queryCache.get(keyName)) {
          var cacheMatch = filterFilter(queryCache.get(keyName), {
            skillId: response.resource.skillId
          }, true);
          
          if (cacheMatch.length > 0){
            queryCache.get(keyName).removeItem(cacheMatch[0]);
          }
        }

        return response.resource;
      };
    }
  ]);
