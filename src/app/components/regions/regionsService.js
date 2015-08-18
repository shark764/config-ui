'use strict';

angular.module('liveopsConfigPanel')
  .factory('Region', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create({
      endpoint: '/v1/regions',
      resourceName: 'Region'
    });
  }]);
