'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUser', ['LiveopsResourceFactory', 'tenantUserInterceptor', 'tenantUserQueryInterceptor', 'cacheAddInterceptor',
    function(LiveopsResourceFactory, tenantUserInterceptor, tenantUserQueryInterceptor, cacheAddInterceptor) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:id',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }, {
          name: 'roleId'
        }],
        getInterceptor: tenantUserInterceptor,
        queryInterceptor: tenantUserQueryInterceptor,
        saveInterceptor: cacheAddInterceptor
      });

      TenantUser.prototype.getDisplay = function(){
        if (this.$user){ //TODO: update unit tests and mocks to all have $user
          return this.$user.getDisplay();
        }
      };
      
      return TenantUser;
    }
  ]);
