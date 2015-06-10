'use strict';

angular.module('liveopsConfigPanel')
  .factory('Skill', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/skills/:id', true, true, [
      'name',
      'description',
      'hasProficiency'
    ]);

  }]);