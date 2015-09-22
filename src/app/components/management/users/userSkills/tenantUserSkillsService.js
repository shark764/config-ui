'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserSkills', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {

      return LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:userId/skills/:skillId',
        resourceName: 'TenantUserSkill',
        updateFields: [{
          name: 'proficiency'
        }],
        requestUrlFields: {
          tenantId: '@tenantId',
          userId: '@userId',
          skillId: '@skillId'
        }
      });

    }
  ]);