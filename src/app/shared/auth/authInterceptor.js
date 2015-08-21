'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$q', '$injector', 'Session', 'apiHostname',
    function ($q, $injector, Session, apiHostname) {

      var Interceptor = function () {

        this.request = function (request) {
          if (request.url.indexOf(apiHostname) >= 0 && Session.token) {
            if (Session.token.indexOf('Token') >= 0){ //Don't prepend Basic if we're using an API session token
              request.headers.Authorization = Session.token;
            } else {
              request.headers.Authorization = 'Basic ' + Session.token;
            }
            
            request.headers['Content-Type'] = 'application/json';
          }

          return request;
        };

        this.responseError = function (response) {
          if (Session.token.indexOf('Token') >= 0){ //If an invite token is invalid, remove the token so the invalid auth header isn't used again
            Session.setToken(null);
          }
          
          return $q.reject(response);
        };
      };

      return new Interceptor();
    }
  ])
  .config(function ($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('AuthInterceptor');
  });
