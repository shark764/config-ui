'use strict';

angular.module('liveopsConfigPanel').controller('RealtimeDashboardsController', ['$scope', 'realtimeDashboardsTableConfig', 'realtimeDashboards',
  function($scope, realtimeDashboardsTableConfig, realtimeDashboards) {
    $scope.realtimeDashboardsTableConfig = realtimeDashboardsTableConfig;
    $scope.dashboards = realtimeDashboards;
  }
]);
