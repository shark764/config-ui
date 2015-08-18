'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUser', ['LiveopsResourceFactory', 'tenantUserInterceptor', 'tenantUserQueryInterceptor',
    function(LiveopsResourceFactory, tenantUserInterceptor, tenantUserQueryInterceptor) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:id',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }],
        getInterceptor: tenantUserInterceptor,
        queryInterceptor: tenantUserQueryInterceptor,
        saveInterceptor: null
      });

      TenantUser.prototype.getDisplay = function(){
        return this.$user.getDisplay();
      };
      
      return TenantUser;
    }
  ]);
