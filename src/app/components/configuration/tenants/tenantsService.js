'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Tenant = LiveopsResourceFactory.create('/v1/tenants/:id', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'status'},
      {name: 'adminUserId'}
    ]);
    
    Tenant.prototype.getDisplay = function () {
      return this.name;
    };
    
    Tenant.resourceName = 'Tenant';
    return Tenant;
  }]);

