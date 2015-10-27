'use strict';

angular.module('liveopsConfigPanel')
  .factory('Integration', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor) {

      var Integration = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/integrations/:id',
        resourceName: 'Integration',
        updateFields: [{
          name: 'properties'
        }, {
          name: 'accountSid'
        }, {
          name: 'authToken'
        }, {
          name: 'webRtc'
        }, {
          name: 'active'
        }],
        updateInterceptor: emitInterceptor
      });

      Integration.prototype.getDisplay = function () {
        return this.type;
      };

      return Integration;
    }
  ]);