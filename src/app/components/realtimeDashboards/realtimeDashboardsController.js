'use strict';

angular.module('liveopsConfigPanel')
  .controller('RealtimeDashboardsController', ['$scope', 'monitorDashboard', function($scope, monitorDashboard) {
    $scope.dashboard = monitorDashboard;
  }]);
