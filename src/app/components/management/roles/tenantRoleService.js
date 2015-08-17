'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantRole', ['LiveopsResourceFactory',
    function(LiveopsResourceFactory) {
      var TenantRole = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/roles/:roleId',
        resourceName: 'TenantRole',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'permissions',
          optional: true
        }]
      });

      TenantRole.prototype.getDisplay = function() {
        return this.name;
      };

      TenantRole.getName = function(roleId) {
        return TenantRole.cachedGet({
          id: roleId
        }).name;
      };

      return TenantRole;
    }
  ]);
