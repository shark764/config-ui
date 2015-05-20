'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserService', ['$resource', function ($resource) {
    return $resource('http://beta.json-generator.com/api/json/get/HZWPSqv', {}, {
    //API response is always an object, but Resource expects an array in response to query(). This config overrides.
      query: { method: 'GET', isArray: false } 
    });
  }]);
