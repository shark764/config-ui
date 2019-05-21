'use strict';

/* global localStorage: false */

// localStorage should not be used to store passwords in production
// this is a temporary solution until Tao gets back to me on the ability to get
// a token back from the API to store instead.

// if this is NOT possible, we will need to setup a slim backend server to manage
// session information using redis or memcache

// this will suffice in beta however.
angular.module('liveopsConfigPanel').service('Session', [
  'sessionKey',
  'preferenceKey',
  '$translate',
  '$filter',
  '$rootScope',
  'loEvents',
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
    this.lastPageVisited = null;
    this.isSso = false;
    this.domain = null;

    /*
      This value does NOT need to be updated every time the config-ui version is
      updated. This value represents the last version we cleared the user's
      localStorage preferences. If this is updated, the user's preferences will
      be cleared when they login next. We should only change this if we absolutely
      need to.
      */
    this.version = '4.64.6';

    this.set = function(user, tenants, token, platformPermissions) {
      this.token = token;
      this.setUser(user);
      this.setTenants(tenants);
      this.setPlatformPermissions(platformPermissions);

      this.flush();
    };

    this.addTenant = function(tenant) {
      self.tenants.push(tenant);
      this.flush();
    };

    this.setIsSso = function(isSso) {
      this.isSso = isSso;
      this.flush();
    };

    this.setLastPageVisited = function(lastPage) {
      if (lastPage && lastPage.stateName !== '' && lastPage.stateName !== 'login') {
        this.lastPageVisited = lastPage;
        this.flush();
      }
    };

    this.setTenants = function(tenants) {
      if (tenants && tenants.length > 0) {
        this.tenants = tenants;
      } else {
        this.tenants = [
          {
            tenantId: '',
            name: $translate.instant('session.tenants.none')
          }
        ];
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
        displayName: user.getDisplay(),
        defaultTenant: user.defaultTenant
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

    this.destroy = function(isLogoutBool) {
      this.token = null;
      this.user = null;
      this.tenant = null;
      this.domain = null;
      this.tenants = null;
      this.platformPermissions = null;
      this.destroyListeners();
      localStorage.removeItem(this.userSessionKey);
      if (isLogoutBool) {
        self.flush(isLogoutBool);
      }
    };

    this.setTenant = function(tenant) {
      self.tenant = {
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName,
        tenantPermissions: tenant.tenantPermissions
      };
      if (CxEngage) {
        CxEngage.session.setActiveTenant({ tenantId: tenant.tenantId, noSession: true });
      }
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

      this.flush();
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

    // adding isLogout argument to prevent deleting properties
    // we want to keep upon user logout
    this.flush = function(isLogout) {
      var preferenceKey = JSON.parse(localStorage.getItem(self.userPreferenceKey));
      var removePreferences = false;

      if (preferenceKey && preferenceKey.appVersion) {
        if (preferenceKey.appVersion !== self.version) {
          removePreferences = true;
          self.columnPreferences = {};
        }
      } else {
        removePreferences = true;
        self.columnPreferences = {};
      }

      var excludedFields = ['channelType', 'direction'];

      Object.keys(self.columnPreferences).forEach(function(key) {
        _.forEach(self.columnPreferences[key], function(field) {
          if (field.header && field.header.options && !_.includes(excludedFields, field.name)) {
            field.header.options = [];
          }
        });
      });

      localStorage.setItem(
        self.userSessionKey,
        JSON.stringify({
          token: isLogout ? null : self.token,
          user: isLogout ? null : self.user,
          tenants: isLogout ? null : self.tenants,
          platformPermissions: self.platformPermissions,
          lastPageVisited: self.lastPageVisited,
          isSso: self.isSso
        })
      );

      localStorage.setItem(
        self.userPreferenceKey,
        JSON.stringify({
          lang: self.lang,
          activeRegionId: self.activeRegionId,
          tenant: isLogout ? null : self.tenant,
          appVersion: self.version,
          columnPreferences: removePreferences ? {} : self.columnPreferences
        })
      );
    };

    this.updateTenantProperty = function(property, tenantId, newValue) {
      var changeFlag = false;

      if (self.tenant && self.tenant.tenantId === tenantId && self.tenant[property] !== newValue) {
        self.tenant[property] = newValue;
        changeFlag = true;
      }

      if (Array.isArray(self.tenants)) {
        self.tenants = self.tenants.map(function(tenant) {
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

    this.setListeners = function() {
      self.listenerDestroyers.push(
        $rootScope.$on(loEvents.resource.updated + ':Tenant', function(event, updatedTenant) {
          self.updateTenantProperty('tenantName', updatedTenant.id, updatedTenant.name);
        }),
        $rootScope.$on('tenant.update.externalChanges', function(event, updatedTenant) {
          self.updateTenantProperty('tenantPermissions', updatedTenant.tenantId, updatedTenant.tenantPermissions);
        })
      );
    };

    this.destroyListeners = function() {
      self.listenerDestroyers.forEach(function(listenerDestroyer) {
        listenerDestroyer();
      });
    };

    this.restore();
    this.setListeners();
  }
]);
