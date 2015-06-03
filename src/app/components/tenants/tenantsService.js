'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantsService', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:id', true, false, [
      'name',
      'description',
      'status',
      'adminUserId'
    ]);
  }]);

