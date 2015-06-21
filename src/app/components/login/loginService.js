'use strict';

angular.module('liveopsConfigPanel')
  .factory('Login', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/login', false, false);
  }]);
