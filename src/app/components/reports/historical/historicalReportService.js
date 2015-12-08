'use strict';

angular.module('liveopsConfigPanel')
  .factory('HistoricalReport', ['LiveopsResourceFactory', 'apiHostname', 'cacheAddInterceptor',
    function(LiveopsResourceFactory, apiHostname, cacheAddInterceptor) {
      var HistoricalReport = LiveopsResourceFactory.create({
        endpoint: apiHostname + '/v1/tenants/:tenantId/reports/token',
        resourceName: 'HistoricalReport',
        updateFields: [{
          name: 'baseUrl'
        }, {
          name: 'requestDatetime'
        }, {
          name: 'reportToken'
        }],
        saveInterceptor: cacheAddInterceptor
      });

      return HistoricalReport;
    }
  ]);
