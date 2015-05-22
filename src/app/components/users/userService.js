'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserService', ['$resource', 'apiHostname', function ($resource, hostname) {
    return $resource('http://' + hostname + '/v1/users', {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  }]);
