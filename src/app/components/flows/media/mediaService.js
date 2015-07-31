'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Media = LiveopsResourceFactory.create('/v1/tenants/:tenantId/media/:id', [
      {name: 'source'},
      {name: 'properties', optional: true}
    ]);
    
    Media.prototype.resourceName = 'Media';
    return Media;
  }]);

