'use strict';

angular.module('liveopsConfigPanel')
  .factory('Flow', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/flows/:id', true, false, [
      {name: 'tenantId'},
      {name: 'description', optional: true},
      {name: 'name'},
      {name: 'activeVersion'},
      {name: 'active'},
      {name: 'channelType', optional: true}
    ],[
      'id', 'tenantId'
    ]);
  }]);

