'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', 'emitInterceptor',
    function (LiveopsResourceFactory, emitInterceptor) {

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
        }],
        saveInterceptor: emitInterceptor,
        updateInterceptor: emitInterceptor
      });

      Tenant.prototype.getDisplay = function () {
        return this.name;
      };

      return Tenant;
    }
  ]);