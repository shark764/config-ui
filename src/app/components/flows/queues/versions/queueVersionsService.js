'use strict';

angular.module('liveopsConfigPanel')
  .factory('QueueVersion', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var QueueVersion = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/queues/:queueId/versions/:id',
        resourceName: 'QueueVersion',
        updateFields: [
          {name: 'name', optional: true},
          {name: 'description', optional: true},
          {name: 'query', optional: true},
          {name: 'minPriority', optional: true},
          {name: 'maxPriority', optional: true},
          {name: 'priorityValue', optional: true},
          {name: 'priorityRate', optional: true},
          {name: 'priorityUnit', optional: true}
        ],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      QueueVersion.prototype.getDisplay = function () {
        return this.name;
      };
      
      QueueVersion.prototype.cacheKey = function () {
        return 'QueueVersion' + this.queueId;
      };

      return QueueVersion;
    }
  ]);