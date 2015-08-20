'use strict';

angular.module('liveopsConfigPanel')
  .service('UserPermissions', ['Session', function (Session) {
      this.hasPermission = function(permissionKey){
        var permissions = [];
        permissions.push.apply(permissions, Session.platformPermissions);
        permissions.push.apply(permissions, Session.tenant.tenantPermissions);
        
        for (var i = 0; i < permissions.length; i++){
          if (permissions[i] === permissionKey){
            return true;
          }
        }
        
        return false;
      };
      
      this.hasPermissionInList = function(permissionList){
        for (var i = 0; i < permissionList.length; i++){
          if (this.hasPermission(permissionList[i])){
            return true;
          }
        }
        
        return false;
      };
    }
  ]);
