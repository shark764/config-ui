'use strict';

angular.module('liveopsConfigPanel')
  .factory('UserService', ['AuthenticatedServiceFactory', function (AuthenticatedServiceFactory) {
    return AuthenticatedServiceFactory.create('/v1/users/:id');
  }]);

