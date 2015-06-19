'use strict';

angular.module('liveopsConfigPanel')
  .factory('QueueVersion', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/queues/:queueId/versions/:id', true, false, [
      'tenantId',
      'name',
      'description',
      'query'
    ]);
  }]);

