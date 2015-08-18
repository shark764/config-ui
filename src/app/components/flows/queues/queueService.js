'use strict';

angular.module('liveopsConfigPanel')
  .factory('Queue', ['LiveopsResourceFactory', 'emitInterceptor',
    function (LiveopsResourceFactory, emitInterceptor) {

      var Queue = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/queues/:id',
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
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      Queue.prototype.getDisplay = function () {
        return this.name;
      };

      return Queue;
    }
  ]);