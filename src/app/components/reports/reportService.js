'use strict';

angular.module('liveopsConfigPanel')
  .factory('Report', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor) {
      var Report = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/reports/token',
        resourceName: 'Report',
        updateFields: [{
          name: 'baseUrl'
        }, {
          name: 'requestDatetime'
        }, {
          name: 'reportToken'
        }],
        saveInterceptor: cacheAddInterceptor
      });

      return Report;
    }
  ]);
