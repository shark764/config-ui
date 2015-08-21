'use strict';

angular.module('liveopsConfigPanel')
  .controller('RealtimeDashboardsController', function($scope, dashboard) {
    $scope.dashboard = dashboard;
  });
