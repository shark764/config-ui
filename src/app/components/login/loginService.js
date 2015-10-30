'use strict';

angular.module('liveopsConfigPanel')
  .factory('Login', ['LiveopsResourceFactory', 'apiHostname',
    function (LiveopsResourceFactory, apiHostname) {

    return LiveopsResourceFactory.create({
      endpoint: apiHostname + '/v1/login',
      resourceName: 'Login'
    });
  }]);
