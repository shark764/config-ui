'use strict';

/* global localStorage: false */

angular.module('liveopsConfigPanel')

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
.factory('Session', ['sessionKey', '$translate', function(sessionKey, $translate) {

  var Session = function () {

    this.userSessionKey = sessionKey;
    this.token = '';
    this.fullName = '';
    this.id = '';
    this.isAuthenticated = false;
    this.lang = '';
    this.tenantId = '';

    this.set = function(token, fullName, id, lang) {
      this.token = token;
      this.fullName = fullName;
      this.id = id;
      this.lang = lang;
      this.isAuthenticated = true;

      if (lang){
        $translate.use(lang);
      };

      this.storeSession();
    };

    this.setTenantId = function(tenantId) {
      this.tenantId = tenantId;
      this.storeSession();
    };

    this.storeSession = function () {
      localStorage.setItem(this.userSessionKey, JSON.stringify(this));
    };

    this.destroy = function() {
      this.token = '';
      this.fullName = '';
      this.id = '';
      this.isAuthenticated = false;
      this.lang = '';
      this.tenantId = '';

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
}]);