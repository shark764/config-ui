'use strict';

angular.module('liveopsConfigPanel')
  .controller('RecordingsController', ['$scope', '$q', '$parse', '$moment', '$filter', 'Recording', 'Session', 'recordingsTableConfig', 'RealtimeStatisticInteraction', 'TenantUser', 'Flow',
    function ($scope, $q, $parse, $moment, $filter, Recording, Session, recordingsTableConfig, RealtimeStatisticInteraction, TenantUser, Flow) {
      var vm = this;
      $scope.forms = {};

      vm.filterObject = function(params, predicate) {
        var newParam = {};
        for(var paramIndex in params) {
          if(predicate(params[paramIndex])) {
            newParam[paramIndex] = params[paramIndex];
          }
        }

        return newParam;
      };

      vm.massageFilters = function() {
        if (!$moment.isMoment($scope.filters.startDate) || !$moment.isMoment($scope.filters.endDate)) {
          $scope.filters.startDate = $moment($scope.filters.startDate);
          $scope.filters.endDate = $moment($scope.filters.endDate);
        }

        var start = $scope.filters.startDate.startOf('day');
        var end = $scope.filters.endDate.endOf('day');

        var params = vm.filterObject({
          'tenantId': Session.tenant.tenantId,
          'start': start.toJSON(),
          'end': end.toJSON(),
          'resourceId': $scope.filters.resource ? $scope.filters.resource.id : null,
          'flowId': $scope.filters.flow ? $scope.filters.flow.id : null
        }, function(value) {
          return !!value;
        });

        return params;
      };

      vm.clearFilters = function() {
        $scope.filters.resource = null;
        $scope.filters.flow = null;
        $scope.filters.startDate = $moment();
        $scope.filters.endDate = $moment();
      };

      vm.searchRecordings = function() {
        var params = vm.massageFilters();
        $scope.recordings = [];
        // These two flags are required because loResourceTable infers a "loading" state based on these properties.
        // Ideally, the loResourceTable would allow you to set a "loading" flag explicitly.
        $scope.recordings.$promise = true;
        $scope.recordings.$resolved = false;
        RealtimeStatisticInteraction.cachedGet(params).$promise.then(function (interactionSearch) {
          var totalResolved = 0;
          if (!interactionSearch.results.interactions.length) {
            $scope.recordings.$resolved = true;
          }
          angular.forEach(interactionSearch.results.interactions, function(interaction) {

            // Set flow names based on flow ids
            $scope.flows.$promise.then(function(flows) {
              interaction.$flowName = flows.filter(function(flow) {
                return interaction.flowId === flow.id;
              })[0].name;
            });

            Recording.query({
              tenantId: Session.tenant.tenantId,
              interactionId: interaction.interactionId
            }).$promise.then(function(recordings) {
              angular.forEach(recordings, function(recording) {
                recording.$interaction = interaction;
                recording.$interaction.startTime = $filter('date')(recording.$interaction.startTime, 'medium');
              });
              $scope.recordings = $scope.recordings.concat(recordings);
              totalResolved++;
              $scope.recordings.$promise = true;
              $scope.recordings.$resolved = totalResolved === interactionSearch.results.interactions.length ? true : false;
            })
            .catch(function() {
              totalResolved++;
              if (totalResolved === interactionSearch.results.interactions.length) {
                $scope.recordings.$resolved = true;
              }
            });
          });
        });
      };

      vm.submit = function() {
        return $scope.selectedRecording.save({
          interactionId: $scope.selectedRecording.interactionId
        });
      };

      vm.loadTenantUsers = function() {
        $scope.tenantUsers = TenantUser.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.loadFlows = function() {
        $scope.flows = Flow.cachedQuery({
          tenantId: Session.tenant.tenantId
        });
      };

      vm.loadTenantUsers();
      vm.loadFlows();

      $scope.tableConfig = recordingsTableConfig;

      $scope.filters = {
        startDate: $moment(),
        endDate: $moment()
      };

      vm.searchRecordings();
    }
  ]);
