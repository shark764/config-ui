'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$q', '$injector', 'Session', 'apiHostname',
    function ($q, $injector, Session, apiHostname) {

      var Interceptor = function () {

        this.request = function (request) {
          if (request.url.indexOf(apiHostname) >= 0 && Session.token) {
            request.headers.Authorization = 'Basic ' + Session.token;
            request.headers['Content-Type'] = 'application/json';
          }

          return request;
        };

        this.responseError = function (response) {
          if (response.status === 401) {
            Session.destroy();
            $injector.get('$state').transitionTo('login');
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
