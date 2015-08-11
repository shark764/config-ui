'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantUser', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {
      var TenantUser = LiveopsResourceFactory.create('/v1/tenants/:tenantId/users/:id', [
        {name: 'status'}
      ]);
      
      TenantUser.prototype.getDisplay = function(){
        if (this.firstName || this.lastName){
          var name = (this.firstName ? this.firstName : '') + ' ' + (this.lastName ? this.lastName : '');
          return name.trim();
        } else {
          return '';
        }
      };
      
      TenantUser.resourceName = 'TenantUser';
      
      return TenantUser;
  }]);
