'use strict';

angular.module('liveopsConfigPanel')
  .factory('Group', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/groups/:id', true, true, [
      'name',
      'description',
      'owner',
      'status'
    ]);

  }]);
