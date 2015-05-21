'use strict';

angular.module('liveopsConfigPanel')

    .factory('AuthInterceptor', ['$rootScope', 'Session', 'api-hostname', function($rootScope, Session, apiHostname) {


        var Interceptor = function () {

            this.request = function(config){
                config.headers = {};

                if(config.url.indexOf(apiHostname) >= 0 && Session.token.length > 0){
                    config.headers.Authorization = 'Basic ' + Session.token;
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