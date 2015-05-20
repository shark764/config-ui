'use strict';

/* global localStorage: false, window: false */

angular.module('liveopsConfigPanel')

    // localStorage should not be used to store passwords in production
    // this is a temporary solution until Tao gets back to me on the ability to get
    // a token back from the API to store instead.

    // if this is NOT possible, we will need to setup a slim backend server to manage
    // session information using redis or memcache

    // this will suffice in beta however.
    .factory('liveopsApiInterceptor', function($rootScope, lodash) {

        var Interceptor = function () {

            this.setCredentials = function(username, password){
                localStorage.liveopsOauth = window.btoa(username + ':' + password);
            };

            this.clearCredentials = function (){
                localStorage.liveopsOauth = null;
            };

            this.request = function(config){
                if(config.url.indexOf('http://beta.json-generator.com') > 0 && localStorage.liveopsOauth){
                    config.headers.Authorization = 'Basic ' + localStorage.liveopsOauth;
                }

                return config;
            };

        };

        return new Interceptor();
    })

    // queue the interceptor
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('liveopsApiInterceptor');
    })

    // this function runs once, and only once, to wire up the route
    // blocking and redirecting.

    // this also wires up the isLoggedIn flag to the rootScope so
    // all controllers, directives, etc can see it.
    .run(function ($rootScope, $location, lodash, liveopsApiInterceptor) {
        $rootScope.isLoggedIn = false;

        $rootScope.$on('$locationChangeStart', function (event, next) {

            if(next.secure && localStorage.liveopsOauth === null) { // if we're on a secure route and we have no token
              event.preventDefault();
              $location.path('/login');
            } else {
              $rootScope.isLoggedIn = true;
            }
        });
    });