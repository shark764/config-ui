'use strict';

angular.module('liveopsConfigPanel')
  .factory('User', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/users/:id', true, true, [
      {name: 'firstName'},
      {name: 'lastName'},
      {name: 'role', optional: true},
      {name: 'displayName'},
      {name: 'status'},
      {name: 'password'},
      {name: 'externalId', optional: true}
    ]);

  }]);
