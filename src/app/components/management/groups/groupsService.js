'use strict';

angular.module('liveopsConfigPanel')
  .factory('Group', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    return LiveopsResourceFactory.create('/v1/tenants/:tenantId/groups/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'owner'},
      {name: 'status', optional: true}
    ]);
  }]);
