'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantRole', ['LiveopsResourceFactory', 'Session', 'cacheAddInterceptor', 'emitInterceptor',
    function(LiveopsResourceFactory, Session, cacheAddInterceptor, emitInterceptor) {
      var TenantRole = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/roles/:id',
        resourceName: 'TenantRole',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'permissions'
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor]
      });

      TenantRole.prototype.getDisplay = function() {
        return this.name;
      };

      TenantRole.getName = function(roleId) {
        console.log(roleId);
        return TenantRole.cachedGet({
          tenantId: Session.tenant.tenantId,
          id: roleId
        }).name;
      };

      return TenantRole;
    }
  ]);
