'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$q', 'Session', 'apiHostname',
    function($q, Session, apiHostname) {
      var Interceptor = function() {
        this.request = function(request) {
          if (request.url.indexOf(apiHostname) >= 0 && Session.token) {
            if (Session.token && Session.token.indexOf('Token') >= 0) {
              //Don't prepend Token if we're using an API session token E.g. from an invite
              request.headers.Authorization = Session.token;
            } else {
              request.headers.Authorization = 'Token ' + Session.token;
            }
          }

          return request;
        };

        this.responseError = function(response) {
          if (Session.token && Session.token.indexOf('Token') >= 0 && response.status === 401) {
            //If an invite token is invalid, remove the token so the invalid auth header isn't used again
            Session.setToken(null);
          }

          return $q.reject(response);
        };
      };

      return new Interceptor();
    }
  ])
  .config(function($httpProvider) {
    // queue the interceptor
    $httpProvider.interceptors.push('AuthInterceptor');
  });
