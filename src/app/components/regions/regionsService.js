'use strict';

angular.module('liveopsConfigPanel')
  .factory('Region', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/regions', 'Region');
  }]);

