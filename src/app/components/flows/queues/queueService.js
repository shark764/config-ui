'use strict';

angular.module('liveopsConfigPanel')
  .factory('Queue', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/queues/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'activeVersion', optional: true},
      {name: 'status'}
    ]);
  }]);
