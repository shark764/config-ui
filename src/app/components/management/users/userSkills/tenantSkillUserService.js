'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantSkillUser', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {

      return LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:skillId/users/:userId',
        resourceName: 'TenantSkillUser'
      });

    }
  ]);