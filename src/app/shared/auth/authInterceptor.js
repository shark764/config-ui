'use strict';

angular.module('liveopsConfigPanel')

  .factory('AuthInterceptor', ['$rootScope', 'Session', 'apiHostname', function($rootScope, Session, apiHostname) {


  var Interceptor = function () {

    this.request = function(config){
      config.headers = {};

      if(config.url.indexOf(apiHostname) >= 0 && Session.token){
          config.headers.Authorization = 'Basic ' + Session.token;
          config.headers['Content-Type'] = 'application/json';
      }

      return config;
    };

  };

    return new Interceptor();
  }])

  // queue the interceptor
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });