'use strict';

angular.module('liveopsConfigPanel')
  .factory('Login', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create({
      endpoint: '/v1/login',
      resourceName: 'Login'
    });
  }]);
