'use strict';

angular.module('liveopsConfigPanel')
  .factory('Media', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, cacheAddInterceptor, emitInterceptor) {

      var Media = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/media/:id',
        resourceName: 'Media',
        updateFields: [{
          name: 'name'
        }, {
          name: 'source'
        }, {
          name: 'type'
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
