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

      this.set = function (user, tenants, token) {
        this.token = token;
        this.setUser(user);
        this.setTenants(tenants);

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

      this.destroy = function () {
        this.token = null;
        this.user = null;

        localStorage.removeItem(this.userSessionKey);
      };

      this.setTenant = function (tenant) {
        self.tenant = {
          tenantId: tenant.tenantId,
          name: tenant.name
        };
        self.flush();
      };

      this.destroyAll = function () {
        this.destroy();
        this.tenant = null;
        this.activeRegionId = null;
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
      
      this.hasPermission = function(permissionKey){
        if (permissionKey === 'VIEW_STUFF' || permissionKey === 'EDIT_STUFF'){
          return false;
        } else {
          return true;
        }
      };
      
      this.hasPermissionInList = function(permissionList){
        for (var i = 0; i < permissionList.length; i++){
          if (this.hasPermission(permissionList[i])){
            return true;
          }
        }
        
        return false;
      };

      this.flush = function () {
        localStorage.setItem(self.userSessionKey, JSON.stringify({
          token: self.token,
          user: self.user,
          tenants: self.tenants
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
