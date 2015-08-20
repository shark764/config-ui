'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantGroupUsers', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {
      return LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/groups/:groupId/users/:memberId',
        resourceName: 'TenantGroupUser',
        requestUrlFields: {
          tenantId: '@tenantId',
          groupId: '@groupId',
          memberId: '@memberId'
        }
      });
    }
  ]);