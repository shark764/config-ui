'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', function() {
    return {
      scope: {
        user: '=',
        display: '=',
        saveField: '='
      },
      templateUrl: 'app/components/users/userList/userDetails/userDetails.html'
    };
 });
