'use strict';

angular.module('liveopsConfigPanel')
  .controller('InteractionsController', ['$scope', '$timeout', 'users', 'flows', 'interactionsTableConfig', 'rtdRefreshRate', 'DashboardPollService', 'TableMiddlewareService',
    function ($scope, $timeout, users, flows, interactionsTableConfig, rtdRefreshRate, DashboardPollService, TableMiddlewareService) {

      $scope.users = users;
      $scope.flows = flows;
      $scope.tableConfig = interactionsTableConfig;
      $scope.refreshRate = rtdRefreshRate;
      $scope.filters = {'durationComparison': '>', 'durationUnit': 'minutes'};

      // Keep a copy of all interactions so they can be re-filtered in between polls
      var allInteractions = {};
      // Keep a copy of the last submitted filters, so they don't filter dynamically
      var submittedFilters = {};

      TableMiddlewareService.entities = TableMiddlewareService.entities.concat($scope.users, $scope.flows);

      $scope.poll = function() {
        $timeout.cancel($scope.timer);

        var requestBody = {'requests': {'tableWidget1': {'statistic': 'interactions-in-conversation-list'}}};
        DashboardPollService.sendBatchReq(requestBody)
          .then(function (response) {
            $scope.interactions = response.data.results.tableWidget1.body.results.interactions;
            TableMiddlewareService.populateIdCells($scope.tableConfig, $scope.interactions);
            allInteractions = angular.copy($scope.interactions);
            filterInteractions();
            $scope.timer = $timeout($scope.poll, $scope.refreshRate);
          })
          .catch(function (err) {
            console.error('-- ERROR -- Reporting API returned an error.',err);
            $scope.timer = $timeout($scope.poll, $scope.refreshRate);
          });
      }

      $scope.submitFilterInteractions = function() {
        submittedFilters = angular.copy($scope.filters);
        filterInteractions();
      }

      function filterInteractions() {
        $scope.interactions = angular.copy(allInteractions);
        for (var i = $scope.interactions.length - 1; i >= 0; i--) {
          var interaction = $scope.interactions[i];
          if (submittedFilters.resource && submittedFilters.resource.getDisplay && interaction.activeParticipants
            && interaction.activeParticipants.indexOf(submittedFilters.resource.getDisplay()) == -1) {

            $scope.interactions.splice(i, 1);
            continue;
          }
          if (submittedFilters.flow && submittedFilters.flow.name != interaction.flowId) {
            $scope.interactions.splice(i, 1);
            continue;
          }
          if (submittedFilters.durationComparison && submittedFilters.duration && submittedFilters.durationUnit) {
            var durationMultiplier;
            if (submittedFilters.durationUnit == 'seconds') {
              durationMultiplier = 1000;
            } else if (submittedFilters.durationUnit == 'minutes') {
              durationMultiplier = 60000;
            }

            if (submittedFilters.durationComparison == '>' && interaction.currentStateDuration < submittedFilters.duration * durationMultiplier) {
              $scope.interactions.splice(i, 1);
              continue;
            } else if (submittedFilters.durationComparison == '<' && interaction.currentStateDuration > submittedFilters.duration * durationMultiplier) {
              $scope.interactions.splice(i, 1);
              continue;
            }
          }
        }
      }

      $scope.clearFilters = function() {
        $scope.filters.resource = null;
        $scope.filters.flow = null;
        $scope.filters.duration = null;
        $scope.submitFilterInteractions();
      };

      $scope.poll();
    }
  ]);
