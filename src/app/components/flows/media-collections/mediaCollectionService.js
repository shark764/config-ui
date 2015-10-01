'use strict';

angular.module('liveopsConfigPanel')
  .factory('MediaCollection', ['LiveopsResourceFactory', 'cacheAddInterceptor', 'emitInterceptor', 'mediaCollectionMapCleanTransformer',
    function (LiveopsResourceFactory, cacheAddInterceptor, emitInterceptor, mediaCollectionMapCleanTransformer) {

      var MediaCollection = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/media-collections/:id',
        resourceName: 'MediaCollection',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'mediaMap',
          optional: true
        }, {
          name: 'defaultMediaKey',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor],
        putRequestTransformer: mediaCollectionMapCleanTransformer
      });

      return MediaCollection;
    }
  ]);
