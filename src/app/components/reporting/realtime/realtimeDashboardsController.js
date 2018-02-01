'use strict';

angular.module('liveopsConfigPanel')
.controller('RealtimeDashboardsController', ['$scope', '$timeout', 'dashboard', 'dashboards', '$state', 'FullscreenService','TableMiddlewareService', '_',
  function($scope, $timeout, dashboard, dashboards, $state, FullscreenService, TableMiddlewareService, _) {

    _.forEach(dashboards, function(dash) {
	    if (!_.isEmpty(dash.activeDashboard)){
	    	dash.activeDashboard.name = dash.name;
	    	dash.activeDashboard.id = dash.id;
	    	dash = dash.activeDashboard;
	    }

      if (dash.id === dashboard) {
        if (!_.isEmpty(dash.activeDashboard)) {
          dash.activeDashboard.name = dash.name;
          dash.activeDashboard.id = dash.id;
        }
        $scope.dashboard = dash;
      }
    });

    $scope.dashboards = dashboards;
  }
]);
