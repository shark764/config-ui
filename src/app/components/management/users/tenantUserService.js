'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUser', ['LiveopsResourceFactory', 'apiHostname', 'tenantUserInterceptor', 'tenantUserQueryInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, tenantUserInterceptor, tenantUserQueryInterceptor, cacheAddInterceptor) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:id',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }, {
          name: 'roleId'
        }, {
          name: 'extensions'
        }],
        getInterceptor: tenantUserInterceptor,
        queryInterceptor: tenantUserQueryInterceptor,
        saveInterceptor: [tenantUserInterceptor, cacheAddInterceptor],
        updateInterceptor: tenantUserInterceptor
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
      
      TenantUser.prototype.isNew = function() {
        return !this.id;
      };
      
      return TenantUser;
    }
  ]);