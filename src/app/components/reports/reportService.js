'use strict';

angular.module('liveopsConfigPanel')
  .factory('Report', ['LiveopsResourceFactory', 'cacheAddInterceptor',
    function(LiveopsResourceFactory, cacheAddInterceptor) {
      var Report = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/reports/token',
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
