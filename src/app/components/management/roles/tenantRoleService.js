'use strict';

angular.module('liveopsConfigPanel')
  .factory('TenantRole', ['LiveopsResourceFactory',
    function (LiveopsResourceFactory) {
      var TenantRole = LiveopsResourceFactory.create('/v1/tenants/:tenantId/roles/:roleId', 'TenantRole', [
        {name: 'name'},
        {name: 'description', optional: true},
        {name: 'permissions', optional: true}
      ]);
      
      TenantRole.prototype.getDisplay = function(){
        return this.name;
      };
      
      return TenantRole;
  }]);
