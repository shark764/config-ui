'use strict';

angular.module('liveopsConfigPanel')
  .factory('FlowVersion', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/flows/:flowId/versions/:version', [
      {name: 'tenantId'},
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'flowId'},
      {name: 'flow'}
    ]);
  }]);

