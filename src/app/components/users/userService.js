'use strict';

angular.module('liveopsConfigPanel')
  .factory('User', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/users/:id', true, true, [
      'firstName',
      'lastName',
      'role',
      'displayName',
      'status',
      'password',
      'state',
      'externalId'
    ], [
        'id'
    ]);

  }]);

