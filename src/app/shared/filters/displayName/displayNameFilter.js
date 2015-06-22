'use strict';

angular.module('liveopsConfigPanel')
  .filter('displayName', ['UserName', '$q', function (UserName, $q) {
    return function (userId) {
      var user = UserName.get(userId);
      return user.displayName;
    };
  }]);
