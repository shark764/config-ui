'use strict';

angular.module('liveopsConfigPanel')
  .service('SaveInterceptor', ['$rootScope', '$q', '$location', 'Session', 'apiHostname',
    function ($rootScope, $q, $location, Session, apiHostname) {
      this.response = function (response) {
        if(response.status = 201){
          $rootScope.$broadcast('created:resource', response.resource);
        }
        
        return response;
      };
    }
  ]);
