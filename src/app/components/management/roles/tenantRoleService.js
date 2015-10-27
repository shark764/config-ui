'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantRole', ['LiveopsResourceFactory', 'apiHostname', 'Session', 'cacheAddInterceptor', 'emitInterceptor',
    function(LiveopsResourceFactory, apiHostname, Session, cacheAddInterceptor, emitInterceptor) {
      var TenantRole = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/roles/:id',
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
        return TenantRole.cachedGet({
          tenantId: Session.tenant.tenantId,
          id: roleId
        }).name;
      };

      return TenantRole;
    }
  ]);
