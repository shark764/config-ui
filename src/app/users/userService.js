'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserService', ['$resource', function ($resource) {
    return $resource('http://beta.json-generator.com/api/json/get/HZWPSqv', {}, {
      query: { method: "GET", isArray: false }
    });
  }]);
