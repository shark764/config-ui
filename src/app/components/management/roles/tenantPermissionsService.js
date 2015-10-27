'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantPermission', ['LiveopsResourceFactory', 'apiHostname',
    function(LiveopsResourceFactory, apiHostname) {
      var TenantPermission = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/permissions/:id',
        resourceName: 'TenantPermission',
        updateFields: []
      });

      TenantPermission.prototype.getDisplay = function() {
        return this.name;
      };

      return TenantPermission;
    }
  ]);
