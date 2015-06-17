'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantGroupUsers', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/groups/:groupId/users', true, true, null, [ 'tenantId', 'groupId' ]);

  }]);
