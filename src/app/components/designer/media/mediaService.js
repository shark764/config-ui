'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/media/:id', true, true, [
      {name: 'source'},
      {name: 'properties', optional: true}
    ]);
  }]);

