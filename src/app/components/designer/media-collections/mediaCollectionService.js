'use strict';

angular.module('liveopsConfigPanel')
  .factory('MediaCollection', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/media-collections/:id', true, true, [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'mediaMap', optional: true}
    ]);
  }]);

