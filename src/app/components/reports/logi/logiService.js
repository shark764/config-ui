'use strict';

angular.module('liveopsConfigPanel')
  .service('Logi', ['$http', '$moment', 'apiHostname', function($http, $moment, apiHostname) {
    var service = {};
    var timezone = $moment.tz.guess();

    service.getLogiToken = function(tenantId, username) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/logi',
        params: {
          timezone: timezone,
          username: username
        }
      });
    };

    service.getSsmToken = function (tenantId, username) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/CxEngageSSM',
        params: {
          timezone: timezone,
          username: username
        }
      });
    };

    service.cycleLogiAuth = function(tenantId, username) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/logi',
        params: {
          timezone: timezone,
          username: username
        }
      });
    };

    service.cycleSsmAuth = function(tenantId, username) {
      return $http({
        method: 'GET',
        url: apiHostname + '/v1/tenants/' + tenantId + '/reporting-token/CxEngageSSM',
        params: {
          timezone: timezone,
          username: username
        }
      });
    };
    
    service.logoutLogi = function(logiBaseUrl, EmbeddedReporting) {
      return $http({
        method: 'GET',
        url: logiBaseUrl + '/rdProcess.aspx?rdProcess=tasks&rdTaskID=Logout',
      });
    };

    service.logoutSSM = function (ssmBaseUrl, EmbeddedReporting) {
      return $http({
        method: 'GET',
        url: ssmBaseUrl + '/rdProcess.aspx?rdProcess=tasks&rdTaskID=Logout',
      });
    };

    return service;
  }]);
