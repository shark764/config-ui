'use strict';

angular.module('liveopsConfigPanel')
  .directive('dashboardVersions', [function() {
    return {
      scope: {
        dashboard: '=',
        onEditClick: '&'
      },
      templateUrl: 'app/components/reporting/realtime/versions/dashboardVersions.html',
      controller: 'DashboardVersionsController'
    };
  }]);
