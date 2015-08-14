'use strict';

angular.module('liveopsConfigPanel')
  .service('tenantUserConverter', ['User', 'TenantUser',
    function (User, TenantUser) {
      this.convert = function(tenantUser) {
        var user = new User(tenantUser);
        delete user.status;
        delete user.roleId;
        return user;
      };

      this.convertBack = function(user, originalTenantUser) {
        var status = originalTenantUser.status;
        var roleId = originalTenantUser.roleId
        angular.extend(originalTenantUser.$original, user);
        originalTenantUser.$original.status = status;
        originalTenantUser.$original.roleId = roleId;
        originalTenantUser.reset();
      };
    }
  ]);