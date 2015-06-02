'use strict';

angular.module('liveopsConfigPanel')
  .factory('QueueService', ['ServiceFactory', function (ServiceFactory) {

    return ServiceFactory.create('/v1/tenants/:tenantId/queues/:id');
  }]);

