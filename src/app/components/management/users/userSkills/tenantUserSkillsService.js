'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUserSkill', ['LiveopsResourceFactory', 'emitInterceptor', 'cacheAddInterceptor', 'userSkillCacheRemoveInterceptor', 'setSkillNameInterceptor', 'removeDefaultProficiencyInterceptor',
    function (LiveopsResourceFactory, emitInterceptor, cacheAddInterceptor, userSkillCacheRemoveInterceptor, setSkillNameInterceptor, removeDefaultProficiencyInterceptor) {

      var TenantUserSkill =  LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:userId/skills/:skillId',
        resourceName: 'TenantUserSkill',
        updateFields: [{
          name: 'proficiency'
        }],
        requestUrlFields: {
          tenantId: '@tenantId',
          userId: '@userId',
          skillId: '@id' //POST requires skillId in the request, which causes POST requests to go to /skills/:skillId, unless that param is renamed
        },
        saveInterceptor: [emitInterceptor, setSkillNameInterceptor, removeDefaultProficiencyInterceptor, cacheAddInterceptor],
        updateInterceptor: [emitInterceptor, setSkillNameInterceptor],
        deleteInterceptor: userSkillCacheRemoveInterceptor
      });
      
      TenantUserSkill.prototype.cacheKey = function () {
        return 'TenantUserSkill' + this.userId;
      };

      return TenantUserSkill;
    }
  ]);