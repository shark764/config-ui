'use strict';

angular.module('liveopsConfigPanel')
.controller('RealtimeDashboardsController', ['$scope', '$timeout', 'dashboard', 'queues', 'flows','users', 'dashboards', '$state', 'FullscreenService','TableMiddlewareService',
  function($scope, $timeout, dashboard, queues, flows, users, dashboards, $state, FullscreenService, TableMiddlewareService) {
    $scope.queues = queues;
    $scope.flows = flows;
    $scope.users = users;
    $scope.dashboard = dashboard;
    $scope.dashboards = dashboards;
  }
]);