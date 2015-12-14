'use strict';

angular.module('liveopsConfigPanel')
  .controller('RealtimeDashboardsController', ['$scope', 'mockDashboard', function($scope, mockDashboard) {
    $scope.dashboard = mockDashboard;
  }]);
