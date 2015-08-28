'use strict';

angular.module('liveopsConfigPanel')
  .factory('Tenant', ['LiveopsResourceFactory', 'emitInterceptor', 'queryCache',
    function (LiveopsResourceFactory, emitInterceptor, queryCache) {

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
      
      //This is an awkward workaround for tenant list functionality 
      //in the case where list should only show current selected tenant due to having MANAGE_TENANT permission
      var obj = Tenant;
      Tenant.prototype.getAsArray = function(id){
        var cached = queryCache.get(id + 'arr');

        if (!cached) {
          var item = obj.get({id: id});
          var mockArray = [item];
          mockArray.$promise = item.$promise;
          mockArray.$resolved = true;
          queryCache.put(id + 'arr', mockArray);
          return mockArray;
        }

        return cached;
      }

      return Tenant;
    }
  ]);