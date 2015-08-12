'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantGroupUsers', ['$resource', 'apiHostname', '$http', 'LiveopsResourceFactory',
    function($resource, apiHostname, $http, LiveopsResourceFactory) {
      return LiveopsResourceFactory.create('/v1/tenants/:tenantId/groups/:groupId/users/:memberId', 'TenantGroupUser', null, {
        tenantId: '@tenantId',
        groupId: '@groupId',
        memberId: '@memberId'
      });
    }
  ]);
