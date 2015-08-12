'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantUserConverter', ['User', 'TenantUser',
    function (User, TenantUser) {
      this.convert = function(tenantUser) {
        return new User(tenantUser);
      };

      this.convertBack = function(user) {
        return new TenantUser(user);
      };
    }
  ]);