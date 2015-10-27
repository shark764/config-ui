'use strict';

angular.module('liveopsConfigPanel')
  .factory('Skill', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor) {
      var Skill = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/skills/:id',
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
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Skill.prototype.getDisplay = function () {
        return this.name;
      };

      return Skill;
    }
  ]);