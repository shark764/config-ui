'use strict';

angular.module('liveopsConfigPanel')
  .factory('Flow', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/flows/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'activeVersion'},
      {name: 'channelType', optional: true},
      {name: 'type'},
      {name: 'active'}
    ]);
  }]);

