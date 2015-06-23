'use strict';

angular.module('liveopsConfigPanel')
  .filter('displayName', ['UserName', function (UserName) {
    return function (userId) {
      var user = UserName.get(userId);
      return user.displayName;
    };
  }]);
