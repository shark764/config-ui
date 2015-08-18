'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', function(LiveopsResourceFactory) {

    var Tenant = LiveopsResourceFactory.create({
      endpoint: '/v1/tenants/:id',
      resourceName: 'Tenant',
      updateFields: [{
        name: 'name'
      }, {
        name: 'description',
        optional: true
      }, {
        name: 'active'
      }, {
        name: 'adminUserId'
      }]
    });

    Tenant.prototype.getDisplay = function() {
      return this.name;
    };

    return Tenant;
  }]);
