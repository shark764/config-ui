'use strict';

angular.module('liveopsConfigPanel')
  .factory('Integration', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/integrations/:id', [
      {name: 'properties'},
      // {name: 'type'},
      {name: 'status'}
    ]);
  }]);

