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
      this.activeRegionId = null;
      this.platformPermissions = null;

      this.set = function (user, tenants, token, platformPermissions) {
        this.token = token;
        this.setUser(user);
        this.setTenants(tenants);
        this.setPlatformPermissions(platformPermissions);
        
        this.flush();
      };

      this.setTenants = function (tenants){

        if(tenants && tenants.length > 0){
          this.tenants = tenants;
        } else {
          this.tenants = [{
            tenantId: '',
            name: $translate.instant('session.tenants.none')
          }];
        }

        this.tenant = this.tenants[0];

        this.flush();
      };

      this.setUser = function (user) {
        this.user = {
          id: user.id,
          displayName: user.getDisplay(),
          email: user.email
        };
        this.flush();
      };

      this.setToken = function (token) {
        this.token = token;
        this.flush();
      };
      
      this.setPlatformPermissions = function(platformPermissions){
        this.platformPermissions = platformPermissions;
        this.flush();
      }

      this.destroy = function () {
        this.token = null;
        this.user = null;

        localStorage.removeItem(this.userSessionKey);
      };

      this.setTenant = function (tenant) {
        self.tenant = {
          tenantId: tenant.tenantId,
          name: tenant.name,
          //TODO: temporary for development
          tenantPermissions: [
            "MANAGE_ALL_ROLES",
            "VIEW_ALL_USERS",
            "VIEW_ALL_LOCATIONS",
            "MANAGE_ALL_USER_EXTENSIONS",
            "VIEW_ALL_QUEUES",
            "VIEW_ALL_PROVIDERS",
            "MANAGE_ALL_GROUPS",
            "VIEW_ALL_CONTACT_POINTS",
            "MANAGE_ALL_GROUP_OWNERS",
            "MANAGE_TENANT_DEFAULTS",
            "VIEW_ALL_RESOURCE_SELECTION",
            "VIEW_ALL_ROLES",
            "VIEW_ALL_FLOWS",
            "MANAGE_ALL_GROUP_USERS",
            "MANAGE_ALL_QUEUES",
            "MAP_ALL_CONTACT_POINTS",
            "MANAGE_ALL_USER_LOCATIONS",
            "MANAGE_ALL_FLOWS",
            "MANAGE_ALL_USER_SKILLS",
            "MANAGE_ALL_RESOURCE_SELECTION",
            "MANAGE_TENANT_LOOK_AND_FEEL",
            "VIEW_ALL_MEDIA",
            "MANAGE_ALL_PROVIDERS",
            "MANAGE_ALL_SKILLS",
            "PURCHASE_CONTACT_POINTS",
            "MANAGE_ALL_LOCATIONS",
            "VIEW_ALL_GROUPS",
            "MANAGE_ALL_REPORTS",
            "VIEW_ALL_REPORTS",
            "MANAGE_ALL_MEDIA",
            "VIEW_ALL_SKILLS"
          ]
        };
        self.flush();
      };

      this.destroyAll = function () {
        this.destroy();
        this.tenant = null;
        this.activeRegionId = null;
        this.lang = 'en';
        this.platformPermissions = null;
        
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

      this.flush = function () {
        localStorage.setItem(self.userSessionKey, JSON.stringify({
          token: self.token,
          user: self.user,
          tenants: self.tenants,
          platformPermissions: self.platformPermissions
        }));

        localStorage.setItem(self.userPreferenceKey, JSON.stringify({
          lang: self.lang,
          activeRegionId: self.activeRegionId,
          tenant: self.tenant
        }));
      };

      this.restore();
    }
  ]);
