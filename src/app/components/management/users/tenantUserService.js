'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUser', ['LiveopsResourceFactory', 'tenantUserInterceptor', 'tenantUserQueryInterceptor',
    function (LiveopsResourceFactory, tenantUserInterceptor, tenantUserQueryInterceptor) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:id',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }, {
          name: 'roleId'
        }],
        getInterceptor: tenantUserInterceptor,
        queryInterceptor: tenantUserQueryInterceptor
      });

      TenantUser.prototype.getDisplay = function () {
        if (this.$user) { //TODO: update unit tests and mocks to all have $user
          return this.$user.getDisplay();
        }
      };

      var reset = TenantUser.prototype.reset;

      TenantUser.prototype.reset = function () {
        reset.call(this);
        
        this.$user.reset();
      };

      return TenantUser;
    }
  ]);