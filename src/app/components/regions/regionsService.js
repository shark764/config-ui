'use strict';

angular.module('liveopsConfigPanel')
  .factory('RegionsService', ['ServiceFactory', function (ServiceFactory) {

    return ServiceFactory.create('/v1/regions');
  }]);

