'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserGroups', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/users/:memberId/groups',
        resourceName: 'TenantUserGroup',
        requestUrlFields: {
          tenantId: '@tenantId',
          memberId: '@memberId'
        }
      });

    }
  ]);