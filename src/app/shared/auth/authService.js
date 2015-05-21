'use strict';

/* global  window: false */

angular.module('liveopsConfigPanel')

    // localStorage should not be used to store passwords in production
    // this is a temporary solution until Tao gets back to me on the ability to get
    // a token back from the API to store instead.

    // if this is NOT possible, we will need to setup a slim backend server to manage
    // session information using redis or memcache

    // this will suffice in beta however.
    .factory('AuthService', function(Session) {

        var AuthService = function () {

            this.login = function (username, password) {
                Session.set(this.generateToken(username, password), 'Ron');
            };

            this.logout = function () {
                Session.destroy();
            };

            this.generateToken = function (username, password) {
                return window.btoa(username + ':' + password);
            };

        };

        return new AuthService();
    })

    // this function runs once, and only once, to wire up the route
    // blocking and redirecting.

    // this also wires up the isLoggedIn flag to the rootScope so
    // all controllers, directives, etc can see it.
    .run(function ($rootScope, $location, Session) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
            if(next.$$route && next.$$route.secure && !Session.isAuthenticated) { // if we're on a secure route and we have no token
              event.preventDefault();
              $location.path('/login');
            }
        });
    });