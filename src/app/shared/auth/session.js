'use strict';

/* global localStorage: false */

angular.module('liveopsConfigPanel')

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
.service('Session', ['$rootScope', 'sessionKey', '$translate', function($rootScope, sessionKey, $translate) {

  var Session = function () {

    var self = this;

    this.userSessionKey = sessionKey;
    this.token = null;
    this.fullName = null;
    this.id = null;
    this.lang = null;
    this.tenantId = null;
    this.isAuthenticated = false;
    this.activeRegionId = '6aff1f30-0901-11e5-87f2-b1d420920055';

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

    $rootScope.$watch('Session.tenantId' , function () {
      self.storeSession();
    });

    this.storeSession = function () {
      localStorage.setItem(this.userSessionKey, JSON.stringify(this));
    };

    this.destroy = function() {
      this.token = null;
      this.fullName = null;
      this.id = null;
      this.lang = null;
      this.tenantId = null;
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
}]);