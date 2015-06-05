'use strict';

angular.module('liveopsConfigPanel')
  .service('UpdateInterceptor', ['$rootScope', '$q', '$location', 'Session', 'apiHostname',
    function ($rootScope, $q, $location, Session, apiHostname) {
      this.response = function (response) {
        if(response.status = 200){
          $rootScope.$broadcast('updated:resource', response.resource);
        }
        
        return response;
      };
    }
  ]);
