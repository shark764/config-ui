'use strict';

/* global localStorage: false, window: false */

angular.module('liveopsConfigPanel')

    // localStorage should not be used to store passwords in production
    // this is a temporary solution until Tao gets back to me on the ability to get
    // a token back from the API to store instead.

    // if this is NOT possible, we will need to setup a slim backend server to manage
    // session information using redis or memcache

    // this will suffice in beta however.
    .factory('Session', function() {

        var Session = function () {

            this.userSessionKey = 'LIVEOPS-SESSION-KEY';
            this.token = '';
            this.fullName = '';
            this.isAuthenticated = false;

            this.set = function(token, fullName) {
                this.token = token;
                this.fullName = fullName;
                this.isAuthenticated = true;

                localStorage.setItem(this.userSessionKey, JSON.stringify(this));
            };

            this.destroy = function() {
                this.token = '';
                this.fullName = '';
                this.isAuthenticated = false;

                localStorage.removeItem(this.userSessionKey);
            };

            this.restore = function() {
                angular.extend(this, JSON.parse(localStorage.getItem(this.userSessionKey)));
            };
        };

        // this only gets called once
        var instance = new Session();
        instance.restore();

        return instance;
    });