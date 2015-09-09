'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantPermission', ['LiveopsResourceFactory',
    function(LiveopsResourceFactory) {
      var TenantPermission = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/permissions/:id',
        resourceName: 'TenantPermission',
        updateFields: []
      });

      TenantPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return TenantPermission;
    }
  ]);
