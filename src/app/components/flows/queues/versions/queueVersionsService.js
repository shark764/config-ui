'use strict';

angular.module('liveopsConfigPanel')
  .factory('QueueVersion', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var QueueVersion = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/queues/:queueId/versions/:id',
      resourceName: 'QueueVersion',
      updateFields: [
        'name',
        'description',
        'query'
      ]
    });

    QueueVersion.prototype.getDisplay = function () {
      return this.name;
    };

    return QueueVersion;
  }]);