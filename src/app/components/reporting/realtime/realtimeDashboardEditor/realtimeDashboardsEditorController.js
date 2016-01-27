'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', 'dashboard', 'queues', 'users', 'dashboards', '$state',
  function($scope, dashboard, queues, users, dashboards, $state) {
    $scope.queues = queues;
    _.each(users, function (u) { u.name = u.firstName + ' ' + u.lastName; });
    $scope.users = users;
    $scope.dashboard = dashboard;
    $scope.dashboards = dashboards;
  }
]);
