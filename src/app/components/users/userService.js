'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserService', ['ServiceFactory', function (ServiceFactory) {

    return ServiceFactory.create('/v1/users/:id');
  }]);

