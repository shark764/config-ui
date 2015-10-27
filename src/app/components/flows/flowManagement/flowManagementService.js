'use strict';

angular.module('liveopsConfigPanel')
  .factory('Flow', ['LiveopsResourceFactory', 'apiHostname', 'emitInterceptor', 'cacheAddInterceptor',
    function (LiveopsResourceFactory, apiHostname, emitInterceptor, cacheAddInterceptor) {

      var Flow = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/flows/:id',
        resourceName: 'Flow',
        updateFields: [{
          name: 'name'
        }, {
          name: 'description',
          optional: true
        }, {
          name: 'activeVersion'
        }, {
          name: 'channelType',
          optional: true
        }, {
          name: 'type'
        }, {
          name: 'active'
        }],
        saveInterceptor: [emitInterceptor, cacheAddInterceptor],
        updateInterceptor: emitInterceptor
      });

      Flow.prototype.getDisplay = function () {
        return this.name;
      };

      return Flow;
    }
  ]);