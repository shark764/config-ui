'use strict';

angular.module('liveopsConfigPanel')
  .service('SaveInterceptor', ['$rootScope', '$q', '$location', 'Session', 'apiHostname', 'queryCache',
    function ($rootScope, $q, $location, Session, apiHostname, queryCache) {
      this.response = function (response) {
        var path = response.config.url.replace(apiHostname + '/v1', '');
        var eventPath = path.replace(/\//g, ':');
        
        var proto = Object.getPrototypeOf(response.resource);

        if(response.status === 201){
          $rootScope.$broadcast('created:resource:' + proto.resourceName, response.resource);
          $rootScope.$broadcast('created:resource' + eventPath, response.resource);
          
          if(!queryCache.get(proto.resourceName)) {
            queryCache.put(key, []);
          }
          
          queryCache.get(proto.resourceName).push(response.resource);
        } else if(response.status === 200) {
          eventPath = eventPath.replace(/:[-\w]+$/, '');
          $rootScope.$broadcast('updated:resource:' + proto.resourceName, response.resource);
          $rootScope.$broadcast('updated:resource' + eventPath, response.resource);
        }

        return response.resource;
      };
    }
  ]);
