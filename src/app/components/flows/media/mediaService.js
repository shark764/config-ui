'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/media/:id', [
      {name: 'source'},
      {name: 'properties', optional: true}
    ]);
  }]);

