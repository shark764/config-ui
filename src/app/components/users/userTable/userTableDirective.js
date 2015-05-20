'use strict';

angular.module('liveopsConfigPanel')
  .directive('userTable', function() {
    return {
      restrict: 'E',
      scope: {
        users: '=users'
      },
      templateUrl: 'app/components/users/userTable/userTable.html'
    };
 });
