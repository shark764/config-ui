'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Tenant = LiveopsResourceFactory.create('/v1/tenants/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'status'},
      {name: 'adminUserId'}
    ]);
    
    Tenant.resourceName = 'Tenant';
    return Tenant;
  }]);

