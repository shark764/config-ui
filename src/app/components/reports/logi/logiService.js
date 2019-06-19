'use strict';

angular.module('liveopsConfigPanel').service('Logi', [
  '$http',
  '$moment',
  'apiHostname',
  function($http, $moment, apiHostname) {
    var service = {};
    var timezone = $moment.tz.guess();

    service.getLogiToken = function(tenantId, tenantName, username) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/logi',
        params: {
          timezone: timezone,
          username: username,
          tenantId: tenantId,
          tenantName: tenantName
        }
      });
    };

    service.getSsmToken = function(tenantId, tenantName, userId, username, userPermissions, impersonate) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/CxEngageSSM',
        params: {
          timezone: timezone,
          tenantId: tenantId,
          tenantName: tenantName,
          userId: userId,
          username: username,
          userPermissions: userPermissions,
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
