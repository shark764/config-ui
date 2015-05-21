'use strict';

angular.module('liveopsConfigPanel')

    .factory('AuthInterceptor', function($rootScope, Session) {

        var Interceptor = function () {

            this.request = function(config){
                if(config.url.indexOf('http://beta.json-generator.com') > 0 && Session.token.length > 0){
                    config.headers.Authorization = 'Basic ' + Session.token;
                }

                return config;
            };

        };

        return new Interceptor();
    })

    // queue the interceptor
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });