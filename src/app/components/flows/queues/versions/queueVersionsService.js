'use strict';

angular.module('liveopsConfigPanel')
  .factory('QueueVersion', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var QueueVersion = LiveopsResourceFactory.create('/v1/tenants/:tenantId/queues/:queueId/versions/:id', [
      'name',
      'description',
      'query'
    ]);
    
    QueueVersion.prototype.getDisplay = function () {
      return this.name;
    };
    
    QueueVersion.resourName = 'QueueVersion';
    return QueueVersion;
  }]);

