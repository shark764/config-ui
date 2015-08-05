'use strict';

angular.module('liveopsConfigPanel')
  .factory('MediaCollection', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var MediaCollection = LiveopsResourceFactory.create('/v1/tenants/:tenantId/media-collections/:id', 'MediaCollection', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'mediaMap', optional: true},
      {name: 'defaultMediaKey', optional: true}
    ]);
    
    return MediaCollection;
  }]);
  