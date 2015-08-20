'use strict';

angular.module('liveopsConfigPanel')
  .filter('hasPermission', ['UserPermissions', function (UserPermissions) {
    return function (permissions) {
      if (! angular.isArray(permissions)){
        permissions = [permissions];
      }
      
      return UserPermissions.hasPermissionInList(permissions);
    };
  }]);