'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserSkills', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/users/:userId/skills/:skillId', true, true, null, [ 'tenantId', 'userId' ]);

  }]);
