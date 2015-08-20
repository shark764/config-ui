'use strict';

angular.module('liveopsConfigPanel')
  .filter('hasPermission', ['Session', function (Session) {
    return function (permissions) {
      return Session.hasPermissionInList(permissions);
    };
  }]);