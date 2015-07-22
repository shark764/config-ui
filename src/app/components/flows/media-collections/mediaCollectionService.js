'use strict';

angular.module('liveopsConfigPanel')
  .factory('MediaCollection', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var MediaCollection = LiveopsResourceFactory.create('/v1/tenants/:tenantId/media-collections/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'mediaMap', optional: true},
      {name: 'defaultMediaKey', optional: true}
    ]);
    
    MediaCollection.resourceName = 'MediaCollection';
    return MediaCollection
  }]);

