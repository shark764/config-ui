'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/users/:memberId/groups',
      resourceName: 'TenantUserGroup',
      requestUrlFields: {
        tenantId: '@tenantId',
        memberId: '@memberId'
      }
    });

  }]);
