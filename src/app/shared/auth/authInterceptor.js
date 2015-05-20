'use strict';

angular.module('liveopsConfigPanel')

    .factory('AuthInterceptor', function($rootScope, AuthService) {

        var Interceptor = function () {

            this.request = function(config){
                if(config.url.indexOf('http://beta.json-generator.com') > 0 && AuthService.user){
                    config.headers.Authorization = 'Basic ' + AuthService.user.token;
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