'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUser', ['LiveopsResourceFactory', 'tenantUserInterceptor', 'tenantUserQueryInterceptor', 'tenantUserUpdateTransformer',
    function (LiveopsResourceFactory, tenantUserInterceptor, tenantUserQueryInterceptor, tenantUserUpdateTransformer) {
      var TenantUser = LiveopsResourceFactory.create({
        endpoint: '/v1/tenants/:tenantId/users/:userId',
        resourceName: 'TenantUser',
        updateFields: [{
          name: 'status'
        }, {
          name: 'roleId'
        }, {
          name: 'extensions'
        }],
        getInterceptor: tenantUserInterceptor,
        queryInterceptor: tenantUserQueryInterceptor,
        putRequestTransformer: tenantUserUpdateTransformer
      });

      TenantUser.prototype.getDisplay = function () {
        if (this.$user) { //TODO: update unit tests and mocks to all have $user
          return this.$user.getDisplay();
        }
      };

      var reset = TenantUser.prototype.reset;

      TenantUser.prototype.reset = function () {
        reset.call(this);
        
        this.$user.reset();
      };

      return TenantUser;
    }
  ])
  .service('tenantUserUpdateTransformer', ['Session', function(Session) {
    return function(tenantUser) {
      if(tenantUser.isNew()) {
        return tenantUser;
      }
      
      if(tenantUser.id === Session.user.id) {
        if(tenantUser.status === 'accepted') {
          delete tenantUser.status;
        }
        
        delete tenantUser.roleId;
      } else {
        delete tenantUser.status;
      }
      
      return tenantUser;
    }
  }]);