'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', '$timeout', 'dashboard', 'queues', 'flows','users', 'dashboards', '$state', 'FullscreenService','TableMiddlewareService',
  function($scope, $timeout, dashboard, queues, flows, users, dashboards, $state, FullscreenService, TableMiddlewareService) {
    $scope.queues = queues;
    _.each(users, function (u) { u.name = u.firstName + ' ' + u.lastName; });
    $scope.users = users;
    $scope.dashboard = dashboard;
    $scope.dashboards = dashboards;
    $scope.toggleFullscreen = FullscreenService.toggleFullscreen;
    $scope.channels = [{name:'All Channels', id:'all'},{name:'Voice', id:'voice'},{name:'SMS', id: 'sms'}];
    $scope.selectedChannel = $scope.channels[0];

    TableMiddlewareService.entities = TableMiddlewareService.entities.concat(users, queues, flows);

    $scope.$watch('selectedDashboard', function(newValue, oldValue) {
      if (newValue === oldValue || oldValue === undefined) { return; }
      $state.go('content.realtime-dashboards-management.editor', {id: newValue.id}, {reload:true});
    });
    $scope.$watch('selectedChannel', function(newValue, oldValue) {
      if (newValue === oldValue || oldValue === undefined) { return; }
      $scope.$broadcast('dashboardChannelChanged', {newChannel: $scope.selectedChannel.id});
    });

    $scope.dashboards.forEach(function(item) {
      item.onClick = function(){
        $scope.selectedDashboard = item;
      };
    });
    $scope.channels.forEach(function(item) {
      item.onClick = function(){
        $scope.selectedChannel = item;
      };
    });
  }
]);
