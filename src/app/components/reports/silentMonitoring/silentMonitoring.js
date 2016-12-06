'use strict';

angular.module('liveopsConfigPanel')
  .controller('SilentMonitoringController', ['$scope', '$timeout', 'users', 'flows', 'silentMonitoringTableConfig', 'rtdRefreshRate', 'DashboardPollService', 'TableMiddlewareService',
    function ($scope, $timeout, users, flows, silentMonitoringTableConfig, rtdRefreshRate, DashboardPollService, TableMiddlewareService) {

      $scope.users = users;
      $scope.flows = flows;
      $scope.tableConfig = silentMonitoringTableConfig;
      $scope.refreshRate = rtdRefreshRate;

      TableMiddlewareService.entities = TableMiddlewareService.entities.concat($scope.users, $scope.flows);

      $scope.poll = function() {
        $timeout.cancel($scope.timer);

        var requestBody = {'requests': {'tableWidget1': {'statistic': 'interactions-in-conversation-list'}}};
        DashboardPollService.sendBatchReq(requestBody)
          .then(function (response) {
            $scope.interactions = response.data.results.tableWidget1.body.results.interactions;
            TableMiddlewareService.populateIdCells($scope.tableConfig, $scope.interactions);
            $scope.timer = $timeout($scope.poll, $scope.refreshRate);
          })
          .catch(function (err) {
            console.error('-- ERROR -- Reporting API returned an error.',err);
            $scope.timer = $timeout($scope.poll, $scope.refreshRate);
          });
      };

      $scope.poll();
    }
  ]);
