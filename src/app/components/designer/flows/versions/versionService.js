'use strict';

angular.module('liveopsConfigPanel')
  .factory('Version', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/flows/:flowId/versions/:id', true, false, [
      {name: 'tenantId'},
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'flowId'},
      {name: 'flow'}
    ]);
  }]);

