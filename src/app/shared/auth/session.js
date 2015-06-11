'use strict';

/* global localStorage: false */

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
angular.module('liveopsConfigPanel')
  .service('Session', ['$rootScope', 'sessionKey', 'preferenceKey', '$translate',
    function ($rootScope, sessionKey, preferenceKey, $translate) {
      var self = this;

      this.userSessionKey = sessionKey;
      this.userPreferenceKey = preferenceKey;

      this.token = null;
      this.user = null;
      this.lang = null;
      this.tenants = null;
      this.tenant = null;
      this.activeRegionId = 'c96cf160-0f18-11e5-8ee6-b1d420920055';
      this.lockSideMenu = false;

      this.set = function (user, tenants, token) {
        this.token = token;
        
        this.user = {
          id: user.id,
          displayName: user.displayName
        }
        
        this.tenants = tenants;
        
        this.storeSession();
      };

      this.storeSession = function () {
        localStorage.setItem(self.userSessionKey, JSON.stringify({
          token: self.token,
          user: self.user,
          tenants: self.tenants
        }));

        localStorage.setItem(self.userPreferenceKey, JSON.stringify({
          lang: self.lang,
          lockSideMenu: self.lockSideMenu,
          activeRegionId: self.activeRegionId,
          tenant: self.tenant
        }));
      };

      this.destroy = function () {
        this.token = null;
        this.user = null;

        localStorage.removeItem(this.userSessionKey);
      };

      this.setLockSideMenu = function(state){
        self.lockSideMenu = state;
        self.storeSession();
      };

      this.setTenant = function (tenant){
        self.tenant = tenant;
        self.storeSession();
      };

      this.destroyAll = function () {
        this.destroy();
        this.tenant = null;
        this.activeRegionId = 'c96cf160-0f18-11e5-8ee6-b1d420920055';
        this.lang = 'en';

        localStorage.removeItem(this.userPreferenceKey);
      };

      this.restore = function () {
        angular.extend(this, JSON.parse(localStorage.getItem(this.userSessionKey)));
        angular.extend(this, JSON.parse(localStorage.getItem(this.userPreferenceKey)));

        //if (this.lang) {
        //  $translate.use(this.lang);
        //}
      };

      this.isAuthenticated = function () {
        return !!this.token;
      };
      
      this.restore();
    }
  ]);
