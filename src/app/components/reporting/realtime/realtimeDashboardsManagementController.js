'use strict';

angular.module('liveopsConfigPanel').controller('RealtimeDashboardsManagementController', ['$scope', 'realtimeDashboardsManagementTableConfig', 'dashboards',
  function($scope, realtimeDashboardsManagementTableConfig, dashboards) {
    $scope.realtimeDashboardsManagementTableConfig = realtimeDashboardsManagementTableConfig;
    $scope.dashboards = dashboards;
  }
]);
