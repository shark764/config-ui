'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/media/:id', true, true, [
      {name: 'name'},
      {name: 'properties', optional: true}
    ], [
      'id', 'tenantId'
    ]);
  }]);

