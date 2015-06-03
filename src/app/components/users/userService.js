'use strict';

angular.module('liveopsConfigPanel').factory('UserService', [
    'LiveopsResourceFactory', function(LiveopsResourceFactory) {
      
      return LiveopsResourceFactory.create('/v1/users/:id', true, false, [
          'firstName', 'lastName', 'status', 'displayName', 'state'
      ]);
    }
]);
