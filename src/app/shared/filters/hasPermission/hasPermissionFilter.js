'use strict';

angular.module('liveopsConfigPanel')
  .filter('hasPermission', ['Session', function (Session) {
    return function (permissions) {
      if (! angular.isArray(permissions)){
        permissions = [permissions];
      }
      
      return Session.hasPermissionInList(permissions);
    };
  }]);