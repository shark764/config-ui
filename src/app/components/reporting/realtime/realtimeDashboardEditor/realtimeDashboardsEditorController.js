'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardsEditorController', ['$scope', 'dashboard',
  function($scope, dashboard) {
    $scope.dashboard = dashboard;
  }
]);
