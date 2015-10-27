'use strict';

angular.module('liveopsConfigPanel')
  .factory('Queue', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var Queue = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/queues/:id',
        resourceName: 'Queue',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'activeVersion',
          optional: true
        }, {
          name: 'active'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Queue.prototype.getDisplay = function () {
        return this.name;
      };

      return Queue;
    }
  ]);