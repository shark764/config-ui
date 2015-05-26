'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetails', function() {
    return {
      scope: {
        user: '=',
        display: '='
      },
      templateUrl: 'app/components/users/userDetails/userDetails.html'
    };
 });
