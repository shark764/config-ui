'use strict';

angular.module('liveopsConfigPanel')
  .service('SaveInterceptor', ['$rootScope', '$q', '$location', 'Session', 'apiHostname',
    function ($rootScope, $q, $location, Session, apiHostname) {
      this.response = function (response) {
        var path = response.config.url.replace(apiHostname + '/v1', '');
        var eventPath = path.replace(/\//g, ':');

        if(response.status === 201){
          $rootScope.$broadcast('created:resource' + eventPath, response.resource);
        } else if(response.status === 200) {
          eventPath = eventPath.replace(/:[-\w]+$/, '');
          $rootScope.$broadcast('updated:resource' + eventPath, response.resource);
        }

        return response.resource;
      };
    }
  ]);
