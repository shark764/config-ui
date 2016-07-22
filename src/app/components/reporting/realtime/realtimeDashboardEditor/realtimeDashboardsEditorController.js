'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', '$timeout', 'dashboard', 'queues', 'flows','users', 'dashboards', '$state', 'FullscreenService','TableMiddlewareService',
  function($scope, $timeout, dashboard, queues, flows, users, dashboards, $state, FullscreenService, TableMiddlewareService) {
    $scope.queues = queues;
    $scope.flows = flows;
    $scope.users = users;
    $scope.dashboard = dashboard;
    $scope.dashboards = dashboards;
    $scope.dashboard.widgets = $scope.dashboard.activeDashboard ? $scope.dashboard.activeDashboard.widgets : [];
  }
]);
