'use strict';

angular.module('liveopsConfigPanel')
  .factory('Group', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor) {

      var Group = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/groups/:id',
        resourceName: 'Group',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'owner'
        }, {
          name: 'active',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        updateInterceptor: emitInterceptor
      });

      Group.prototype.getDisplay = function () {
        return this.name;
      };

      return Group;
    }
  ]);