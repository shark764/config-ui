'use strict';

/* global localStorage: false */

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
angular.module('liveopsConfigPanel')
  .service('Session', ['$rootScope', 'sessionKey', '$translate', function ($rootScope, sessionKey, $translate) {
    var self = this;
    
    this.userSessionKey = sessionKey;
    this.token = null;
    this.displayName = null;
    this.id = null;
    this.lang = null;
    this.tenantId = null;
    this.activeRegionId = '6aff1f30-0901-11e5-87f2-b1d420920055';
    this.collapseSideMenu = true;
    
    this.set = function (user, token) {
      this.token = token;
      this.displayName = user.displayName;
      this.id = user.id;
      this.lang = 'en';

      if (this.lang) {
        $translate.use(this.lang);
      }

      this.storeSession();
    };

    $rootScope.$watch('Session.tenantId', function () {
      self.storeSession();
    });

    this.storeSession = function () {
      localStorage.setItem(this.userSessionKey, JSON.stringify({
        token: this.token,
        tenantId: this.tenantId,
        displayName: this.displayName,
        id: this.id,
        lang: this.lang
      }));
    };

    this.destroy = function () {
      this.token = null;
      this.displayName = null;
      this.id = null;
      this.lang = null;
      this.tenantId = null;
      this.activeRegionId = null;
      this.collapseSideMenu = true;
      
      localStorage.removeItem(this.userSessionKey);
    };

    this.restore = function () {
      angular.extend(this, JSON.parse(localStorage.getItem(this.userSessionKey)));
    };

    this.isAuthenticated = function () {
      return !!this.token;
  };

    this.restore();
  }]);
