'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantRole', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Media = LiveopsResourceFactory.create('/v1/tenants/:tenantId/roles/:id', 'TenantRole', [
      {name: 'name'},
      {name: 'description', optional: true}
    ]);
    
    return Media;
  }]);
