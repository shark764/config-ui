'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', 'dashboard', 'queues', 'users',
  function($scope, dashboard, queues, users) {
    $scope.queues = queues;
    _.each(users, function (u) { u.name = u.firstName + ' ' + u.lastName; });
    $scope.users = users;
    $scope.dashboard = dashboard;
  }
]);
