'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', 'dashboard', 'queues', 'users', 'dashboards', '$state', 'FullscreenService',
  function($scope, dashboard, queues, users, dashboards, $state, FullscreenService) {
    $scope.queues = queues;
    _.each(users, function (u) { u.name = u.firstName + ' ' + u.lastName; });
    $scope.users = users;
    $scope.dashboard = dashboard;
    $scope.dashboards = dashboards;
    $scope.toggleFullscreen = FullscreenService.toggleFullscreen;

    $scope.$watch('selectedDashboard', function(newValue, oldValue) {
      if (newValue === oldValue || oldValue === undefined) { return; }
      $state.go('content.realtime-dashboards-management.editor', {id: newValue.id}, {reload:true});
    });
  }
]);
