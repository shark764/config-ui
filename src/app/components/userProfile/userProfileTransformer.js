'use strict';

angular.module('liveopsConfigPanel')
  .service('userProfileUpdateRequestTransformer', [
    function() {
      return function(tenantUser) {
        delete tenantUser.status; //User cannot edit their own status
        delete tenantUser.roleId; //User cannot edit their own platform roleId
        
        return tenantUser;
      };
    }
  ]);
