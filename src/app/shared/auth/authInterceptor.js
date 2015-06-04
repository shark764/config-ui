'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$q', '$location', 'Session', 'apiHostname',
    function ($q, $location, Session, apiHostname) {

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
            $location.path('/login');
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