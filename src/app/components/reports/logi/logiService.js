'use strict';

angular.module('liveopsConfigPanel')
  .service('Logi', ['$http', '$moment', 'apiHostname', function($http, $moment, apiHostname) {
    var service = {};

    service.getToken = function(tenantId, username) {
      var timezone = $moment.tz.guess();
      var response = $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/logi',
        params: {
          timezone: timezone,
          username: username
        }
      });
      return response;
    };

    return service;
  }]);
