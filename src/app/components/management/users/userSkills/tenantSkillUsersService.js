'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantSkillUsers', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {

      return LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/skills/:skillId/users/:userId',
        resourceName: 'TenantSkillUser'
      });

    }
  ]);