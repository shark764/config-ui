'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserProfile', ['LiveopsResourceFactory', 'userProfileUpdateRequestTransformer', 'tenantUserInterceptor',
    function (LiveopsResourceFactory, userProfileUpdateRequestTransformer, tenantUserInterceptor) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:id',
        resourceName: 'UserProfile',
        updateFields: [{
          name: 'extensions'
        }],
        getInterceptor: tenantUserInterceptor
      });

      return TenantUser;
    }
  ]);