'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Media = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:tenantId/media/:id',
      resourceName: 'Media',
      updateFields: [
        {name: 'source'},
        {name: 'properties', optional: true}
      ]
    });
    
    return Media;
  }]);
