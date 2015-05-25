'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', function() {
    return {
      scope: {
        user: '=',
        userFields: '=',
        display: '=',
        saveField: '='
      },
      templateUrl: 'app/components/users/userList/userDetails/userDetails.html'
    };
 });
