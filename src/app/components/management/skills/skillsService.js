'use strict';

angular.module('liveopsConfigPanel')
  .factory('Skill', ['LiveopsResourceFactory', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, cacheAddInterceptor, emitInterceptor) {
      var Skill = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/skills/:id',
        resourceName: 'Skill',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'hasProficiency'
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: cacheAddInterceptor,
        updateInterceptor: emitInterceptor
      });

      Skill.prototype.getDisplay = function () {
        return this.name;
      };

      return Skill;
    }
  ]);