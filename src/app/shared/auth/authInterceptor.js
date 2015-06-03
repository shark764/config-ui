'use strict';

angular.module('liveopsConfigPanel')
  .factory('AuthInterceptor', ['$rootScope', '$location', 'Session', 'apiHostname',
    function ($rootScope, $location, Session, apiHostname) {

      var Interceptor = function () {

        this.request = function (request) {
          if (Session.token) {
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

          return response;
        }
      };

      return new Interceptor();
    }
  ])

  // queue the interceptor
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });