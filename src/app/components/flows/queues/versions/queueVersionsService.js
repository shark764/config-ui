'use strict';

angular.module('liveopsConfigPanel')
  .factory('QueueVersion', ['LiveopsResourceFactory', 'emitInterceptor',
    function (LiveopsResourceFactory, emitInterceptor) {

      var QueueVersion = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/queues/:queueId/versions/:id',
        resourceName: 'QueueVersion',
        updateFields: [
          'name',
          'description',
          'query'
        ],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      QueueVersion.prototype.getDisplay = function () {
        return this.name;
      };

      return QueueVersion;
    }
  ]);