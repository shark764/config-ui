'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserService', ['$resource', 'api-hostname', function ($resource, hostname) {
    return $resource('http://' + hostname + '/v1/users', {}, {
      query: {
        method: 'GET',
        isArray: false
      },
      get: {
        method: 'GET',
        isArray: false
      }
    });
  }]);