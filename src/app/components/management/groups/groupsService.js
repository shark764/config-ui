'use strict';

angular.module('liveopsConfigPanel')
  .factory('Group', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Group = LiveopsResourceFactory.create('/v1/tenants/:tenantId/groups/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'owner'},
      {name: 'status', optional: true}
    ]);
    
    Group.resourceName = 'Group';
    return Group;
  }]);
