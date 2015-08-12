'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', function (LiveopsResourceFactory) {

    var Tenant = LiveopsResourceFactory.create('/v1/tenants/:id', 'Tenant', [
      {name: 'name'},
      {name: 'description', optional: true},
      {name: 'active'},
      {name: 'adminUserId'}
    ]);
    
    Tenant.prototype.getDisplay = function () {
      return this.name;
    };
    
    return Tenant;
  }]);

