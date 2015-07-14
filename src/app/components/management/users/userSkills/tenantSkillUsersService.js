'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantSkillUsers', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/skills/:skillId/users/:userId');

  }]);