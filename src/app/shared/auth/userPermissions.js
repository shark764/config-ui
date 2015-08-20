'use strict';

angular.module('liveopsConfigPanel')
  .service('UserPermissions', [function () {
      this.hasPermission = function(permissionKey){
        if (permissionKey === 'VIEW_STUFF' || permissionKey === 'EDIT_STUFF'){
          return false;
        } else {
          return true;
        }
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
