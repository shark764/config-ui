'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', function() {
    return {
      scope: {
        user: '='
      },
      templateUrl: 'app/components/users/userList/userDetails/userDetails.html'
    };
 });
