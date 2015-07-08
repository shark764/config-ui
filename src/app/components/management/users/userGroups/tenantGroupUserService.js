'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantGroupUsers', ['$resource', 'apiHostname', '$http', function ($resource, apiHostname, $http) {


    function appendTransform(defaults, transform) {
      // We can't guarantee that the default transformation is an array
      defaults = angular.isArray(defaults) ? defaults : [defaults];

      // Append the new transformation to the defaults
      return defaults.concat(transform);
    }

    function getResult(value) {
      if (value.result) {
        return value.result;
      }

      return value;
    }

    return $resource(apiHostname + '/v1/tenants/:tenantId/groups/:groupId/users/:memberId', {
      tenantId: '@tenantId',
      groupId: '@groupId',
      memberId: '@memberId'
    }, {
      save: {
        method: 'POST',

        transformResponse: appendTransform($http.defaults.transformResponse, function (value) {

          return getResult(value);
        })
      },

      query: {
        method: 'GET',

        isArray: true,
        transformResponse: appendTransform($http.defaults.transformResponse, function (value) {
          return getResult(value);
        })
      },
    });

  }]);