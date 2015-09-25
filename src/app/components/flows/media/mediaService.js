'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, cacheAddInterceptor, emitInterceptor) {

      var Media = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/media/:id',
        resourceName: 'Media',
        updateFields: [{
          name: 'source'
        }, {
          name: 'properties',
          optional: true
        }],
        saveInterceptor: [cacheAddInterceptor, emitInterceptor]
      });

       Media.prototype.getDisplay = function (){
       return this.name;
      };
    
      return Media;
    }
  ]);
