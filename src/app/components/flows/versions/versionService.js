'use strict';

angular.module('liveopsConfigPanel')
  .factory('Version', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/flows/:flowId/versions/:id', true, false, [
      'tenantId',
      'description',
      'name',
      'activeVersion',
      'flowId',
      'flow',
      'version'
    ]);
  }]);

