'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantGroupUsers', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {
      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:groupId/users/:memberId',
        resourceName: 'TenantGroupUser',
        requestUrlFields: {
          tenantId: '@tenantId',
          groupId: '@groupId',
          memberId: '@memberId'
        }
      });
    }
  ]);