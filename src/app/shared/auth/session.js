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
      this.displayName = null;
      this.id = null;
      this.lang = null;
      this.tenant = null;
      this.activeRegionId = '6aff1f30-0901-11e5-87f2-b1d420920055';
      this.collapseSideMenu = true;

      this.set = function (user, token) {
        this.token = token;
        this.displayName = user.displayName;
        this.id = user.id;

        this.storeSession();
      };

      $rootScope.$watch('Session.tenant', self.storeSession);
      $rootScope.$watch('Session.collapseSideMenu', self.storeSession);

      this.storeSession = function () {
        localStorage.setItem(this.userSessionKey, JSON.stringify({
          token: this.token,
          displayName: this.displayName,
          id: this.id,
        }));

        localStorage.setItem(this.userPreferenceKey, JSON.stringify({
          tenant: this.tenant,
          lang: this.lang,
          collapseSideMenu: this.collapseSideMenu,
          activeRegionId: this.activeRegionId
        }));
      };

      this.destroy = function () {
        this.token = null;
        this.displayName = null;
        this.id = null;

        localStorage.removeItem(this.userSessionKey);
      };

      this.destroyAll = function () {
        this.destroy();
        this.tenant = null;
        this.activeRegionId = null;
        this.lang = null;

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
