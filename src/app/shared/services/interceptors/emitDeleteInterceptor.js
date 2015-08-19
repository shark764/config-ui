'use strict';

angular.module('liveopsConfigPanel')
  .service('DeleteInterceptor', ['$rootScope', 'apiHostname',
    function ($rootScope, apiHostname) {
      this.response = function (response) {
        var path = response.config.url.replace(apiHostname + '/v1', '');
        var eventPath = path.replace(/\//g, ':');
        
        var proto = Object.getPrototypeOf(response.resource);

        $rootScope.$broadcast('deleted:resource:' + proto.resourceName, response.resource);
        $rootScope.$broadcast('deleted:resource' + eventPath, response.resource);
        
        return response.resource;
      };
    }
  ]);
