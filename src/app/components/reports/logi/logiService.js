'use strict';

angular.module('liveopsConfigPanel').service('Logi', [
  '$http',
  '$moment',
  'apiHostname',
  function($http, $moment, apiHostname) {
    var service = {};
    var timezone = $moment.tz.guess();

    service.getLogiToken = function(tenantId, tenantName, username, impersonate) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/logi',
        params: {
          timezone: timezone,
          username: username,
          tenantId: tenantId,
          tenantName: tenantName,
          impersonate: impersonate
        }
      });
    };

    service.getSsmToken = function(tenantId, tenantName, username, impersonate) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/CxEngageSSM',
        params: {
          timezone: timezone,
          username: username,
          tenantId: tenantId,
          tenantName: tenantName,
          impersonate: impersonate
        }
      });
    };

    service.getLogiBaseUrl = function(tenantId) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/logi',
        params: {
          secureKeyRequest: false
        }
      });
    };
    service.getSsmBaseUrl = function(tenantId) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/CxEngageSSM',
        params: {
          secureKeyRequest: false
        }
      });
    };

    return service;
  }
]);
