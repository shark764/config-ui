'use strict';

angular.module('liveopsConfigPanel')
  .directive('userDetailPanel', ['TenantUserGroups', 'TenantGroupUsers', 'Group', 'Session', '$timeout', '$filter', 'Alert', '$q', 'queryCache',
    function (TenantUserGroups, TenantGroupUsers, Group, Session, $timeout, $filter, Alert, $q, queryCache) {
      return {
        restrict: 'E',
        scope: {
          selectedTenantUser: '='
        },
        templateUrl: 'app/components/management/users/userDetailPanel/userDetailPanelDirective.html',
        controller: 'UserDetailPanelController'
      };
    }
  ]);
