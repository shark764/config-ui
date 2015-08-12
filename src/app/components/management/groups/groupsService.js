'use strict';

angular.module('liveopsConfigPanel')
  .factory('Group', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Group = LiveopsResourceFactory.create('/v1/tenants/:tenantId/groups/:id', 'Group', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'owner'},
      {name: 'active', optional: true}
    ]);
    
    Group.prototype.getDisplay = function () {
      return this.name;
    };
    
    return Group;
  }]);
