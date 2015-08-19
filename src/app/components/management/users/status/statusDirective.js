'use strict';

angular.module('liveopsConfigPanel')
  .directive('tenantUserStatus', function() {
    return {
      templateUrl : 'app/components/management/users/status/status.html',
      scope : {
        ngModel : '=',
        ngDisabled : '='
      }
    };
   });