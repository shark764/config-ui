'use strict';

/* global localStorage: false */

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
angular.module('liveopsConfigPanel')
  .service('Session', ['sessionKey', 'preferenceKey', '$translate', '$filter', '$rootScope', 'loEvents',
    function(sessionKey, preferenceKey, $translate, $filter, $rootScope, loEvents) {
      var self = this;

      this.userSessionKey = sessionKey;
      this.userPreferenceKey = preferenceKey;

      this.token = null;
      this.user = null;
      this.lang = null;
      this.tenants = null;
      this.tenant = null;
      this.activeRegionId = null;
      this.columnPreferences = {};
      this.platformPermissions = null;

      this.set = function(user, tenants, token, platformPermissions) {
        this.token = token;
        this.setUser(user);
        this.setTenants(tenants);
        this.setPlatformPermissions(platformPermissions);

        this.flush();
      };

      this.setTenants = function(tenants) {
        if (tenants && tenants.length > 0) {
          this.tenants = tenants;
        } else {
          this.tenants = [{
            tenantId: '',
            name: $translate.instant('session.tenants.none')
          }];
        }

        if (this.tenant) {
          //Keep the previously selected tenant
          var matches = $filter('filter')(this.tenants, {
            tenantId: this.tenant.tenantId
          });
          if (matches.length > 0) {
            this.tenant = matches[0];
          } else {
            this.tenant = this.tenants[0];
          }
        } else {
          this.tenant = this.tenants[0];
        }

        this.flush();
      };

      this.setUser = function(user) {
        this.user = {
          id: user.id,
          displayName: user.getDisplay()
        };
        this.flush();
      };

      this.setToken = function(token) {
        this.token = token;
        this.flush();
      };

      this.setPlatformPermissions = function(platformPermissions) {
        this.platformPermissions = platformPermissions;
        this.flush();
      };

      this.setColumnPreferences = function(columnPreferences) {
        this.columnPreferences = columnPreferences;
        this.flush();
      };

      this.destroy = function() {
        this.token = null;
        this.user = null;
        this.tenant = null;
        this.tenants = null;
        this.platformPermissions = null;
        this.destroyListeners();
        localStorage.removeItem(this.userSessionKey);
      };

      this.setTenant = function(tenant) {
        self.tenant = {
          tenantId: tenant.tenantId,
          tenantName: tenant.tenantName,
          tenantPermissions: tenant.tenantPermissions
        };
        self.flush();
      };

      this.destroyAll = function() {
        this.destroy();
        this.activeRegionId = null;
        this.lang = 'en';
        this.tenant = null;
        localStorage.removeItem(this.userPreferenceKey);
      };

      this.restore = function() {
        angular.extend(this, JSON.parse(localStorage.getItem(this.userSessionKey)));
        angular.extend(this, JSON.parse(localStorage.getItem(this.userPreferenceKey)));
      };

      this.isAuthenticated = function() {
        if (!this.token) {
          return false;
        } else {
          if (angular.isString(this.token)) {
            return this.token.indexOf('Token') < 0; //Prevent page load error when still authenticated with temp token
          }
        }
      };

      this.flush = function() {
        localStorage.setItem(self.userSessionKey, JSON.stringify({
          token: self.token,
          user: self.user,
          tenants: self.tenants,
          platformPermissions: self.platformPermissions
        }));

        localStorage.setItem(self.userPreferenceKey, JSON.stringify({
          lang: self.lang,
          activeRegionId: self.activeRegionId,
          tenant: self.tenant,
          columnPreferences: self.columnPreferences
        }));
      };

      this.updateTenantProperty = function (property, tenantId, newValue) {
        var changeFlag = false;

        if (self.tenant && self.tenant.tenantId === tenantId && self.tenant[property] !== newValue) {
          self.tenant[property] = newValue;
          changeFlag = true;
        }

        if (Array.isArray(self.tenants)) {
          self.tenants = self.tenants.map(function (tenant) {
            if (tenant.tenantId === tenantId && tenant[property] !== newValue) {
              tenant[property] = newValue;
              $rootScope.$broadcast(loEvents.session.tenants.updated);
              changeFlag = true;
            }
            return tenant;
          });
        }

        if (changeFlag) {
          self.flush();
        }
      };

      this.listenerDestroyers = [];

      this.setListeners = function () {
        self.listenerDestroyers.push(
          $rootScope.$on(
            loEvents.resource.updated + ':Tenant',
            function (event, updatedTenant) {
              self.updateTenantProperty('tenantName', updatedTenant.id, updatedTenant.name);
            }
          )
        );
      };

      this.destroyListeners = function () {
        self.listenerDestroyers.forEach(function(listenerDestroyer) {
          listenerDestroyer();
        });
      };

      this.restore();
      this.setListeners();
    }
  ]);
