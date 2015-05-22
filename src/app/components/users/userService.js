'use strict';

angular.module('liveopsConfigPanel')
.factory('UserService', ['$resource', 'apiHostname', function ($resource, hostname) {
  return $resource('http://' + hostname + '/v1/users/:id', {}, {
    //API response is always an object, but Resource expects an array in response to query(). This config overrides.
    query: { method: 'GET', isArray: false },
    update: { method: 'PUT' }
  });
}]);

