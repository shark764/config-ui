'use strict';

/* global localStorage: false, window: false */

angular.module('liveopsConfigPanel')

    // localStorage should not be used to store passwords in production
    // this is a temporary solution until Tao gets back to me on the ability to get
    // a token back from the API to store instead.

    // if this is NOT possible, we will need to setup a slim backend server to manage
    // session information using redis or memcache

    // this will suffice in beta however.
    .factory('AuthService', function($rootScope) {

        var USER_SESSION_KEY = 'LIVEOPS-SESSION-KEY';

        var authService = {

            user : JSON.parse(localStorage.getItem(USER_SESSION_KEY)),

            login : function (username, password) {
                this.user = {
                    token : window.btoa(username + ':' + password),
                    fullName: 'Ron'
                };

                localStorage.setItem(USER_SESSION_KEY, JSON.stringify(this.user));
            },

            logout : function () {
                this.user = null;

                localStorage.removeItem(USER_SESSION_KEY);
            }

        };

        return authService;
    })

    // this function runs once, and only once, to wire up the route
    // blocking and redirecting.

    // this also wires up the isLoggedIn flag to the rootScope so
    // all controllers, directives, etc can see it.
    .run(function ($rootScope, $location, AuthService) {
        $rootScope.isLoggedIn = false;

        $rootScope.$on('$locationChangeStart', function (event, next) {

            if(next.secure && AuthService.user) { // if we're on a secure route and we have no token
              event.preventDefault();
              $location.path('/login');
            }
        });
    });