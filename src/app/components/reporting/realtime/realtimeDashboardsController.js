'use strict';

angular.module('liveopsConfigPanel')
.controller('RealtimeDashboardsController', ['$scope', '$timeout', 'dashboard', 'dashboards', '$state', 'FullscreenService','TableMiddlewareService', '_',
  function($scope, $timeout, dashboard, dashboards, $state, FullscreenService, TableMiddlewareService, _) {

    _.forEach(dashboards, function(dash) {
      if (dash.id === dashboard) {
        var currentDashboard = window.allDashboards.find(function (item) {
          return item.id === dash.id;
        });
        if (currentDashboard.dashboardCategory === 'Standard Dashboards') {
          $scope.dashboard = currentDashboard;
        } else {
          $scope.dashboard = currentDashboard.activeDashboard;
        }
      }
    });

    $scope.dashboards = dashboards;
  }
]);
