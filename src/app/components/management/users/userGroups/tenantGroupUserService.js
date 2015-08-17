'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantGroupUsers', ['$resource', 'apiHostname', '$http', 'LiveopsResourceFactory',
    function($resource, apiHostname, $http, LiveopsResourceFactory) {
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
