'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', '$timeout', 'dashboard', 'queues', 'flows','users', 'dashboards',
  function($scope, $timeout, dashboard, queues, flows, users, dashboards) {
    $scope.queues = queues;
    $scope.flows = flows;
    $scope.users = users;
    $scope.dashboard = dashboard;
    $scope.dashboards = dashboards;
    $scope.dashboard.widgets = $scope.dashboard.activeDashboard ? $scope.dashboard.activeDashboard.widgets : [];
  }
]);
