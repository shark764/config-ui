'use strict';

angular.module('liveopsConfigPanel')
  .factory('MediaCollection', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/media-collections/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'mediaMap', optional: true},
      {name: 'defaultMediaKey', optional: true}
    ]);
  }]);

