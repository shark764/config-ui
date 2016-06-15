'use strict';

angular.module('liveopsConfigPanel')
.controller('RealtimeDashboardsController', ['$scope', '$timeout', 'dashboard', 'queues', 'flows','users', 'dashboards', '$state', 'FullscreenService','TableMiddlewareService', '_',
  function($scope, $timeout, dashboard, queues, flows, users, dashboards, $state, FullscreenService, TableMiddlewareService, _) {
    $scope.queues = queues;
    $scope.flows = flows;
    $scope.users = users;

	if (!_.isEmpty(dashboard.activeDashboard)){
    	dashboard.activeDashboard.name = dashboard.name;
    	dashboard.activeDashboard.id = dashboard.id;
    	dashboard = dashboard.activeDashboard;
    }

    $scope.dashboard = dashboard;

    _.forEach(dashboards, function(dash) {
	    if (!_.isEmpty(dash.activeDashboard)){
	    	dash.activeDashboard.name = dash.name;
	    	dash.activeDashboard.id = dash.id;
	    	dash = dash.activeDashboard;
	    }
    });

    $scope.dashboards = dashboards;
  }
]);