'use strict';

angular.module('liveopsConfigPanel')

  .factory('AuthInterceptor', ['$rootScope', 'Session', 'apiHostname', function($rootScope, Session, apiHostname) {


  var Interceptor = function () {

    this.request = function(config){
      config.headers = {};

      

      if (config.method == "POST"){
        config.data.createdBy = Session.id;
      } else if (config.method == "PUT") {
        config.data.updatedBy = Session.id;
      }

      if(config.url.indexOf(apiHostname) >= 0 && Session.token.length > 0){
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