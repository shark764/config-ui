'use strict';

angular.module('liveopsConfigPanel')
  .factory('Flow', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/flows/:id', true, false, [
      'tenantId',
      'description',
      'name',
      'activeVersion',
      'active',
      'channelType'
    ]);
  }]);

