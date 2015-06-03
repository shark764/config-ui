'use strict';

angular.module('liveopsConfigPanel')
  .factory('RegionsService', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/regions');
  }]);

