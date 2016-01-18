'use strict';

angular.module('liveopsConfigPanel').controller('RealtimeDashboardsManagementController', ['$scope', 'realtimeDashboardsManagementTableConfig', 'dashboards',
  function($scope, realtimeDashboardsTableConfig, dashboards) {
    $scope.realtimeDashboardsTableConfig = realtimeDashboardsTableConfig;
    $scope.dashboards = dashboards;
    console.log('thing', $scope.dashboards);
  }
]);
