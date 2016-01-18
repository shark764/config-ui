'use strict';

angular.module('liveopsConfigPanel')
.controller('realtimeDashboardDesignerController', ['$rootScope', '$scope', 'Queue', 'Session', '$q', '$filter', '$stateParams', 'dashboard',
  function($rootScope, $scope, realtimeDashboards, Queue, Session, $q, $filter, $stateParams) {
    var vm = this;

    $scope.dashboard = dashboard;
  }
]);
