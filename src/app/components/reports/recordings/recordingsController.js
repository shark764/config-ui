'use strict';

angular.module('liveopsConfigPanel')
  .controller('RecordingsController', ['$scope', '$q', '$parse', '$moment', 'Recording', 'Session', 'recordingsTableConfig', 'RealtimeStatisticInteraction', 'TenantUser', 'Flow',
    function ($scope, $q, $parse, $moment, Recording, Session, recordingsTableConfig, RealtimeStatisticInteraction, TenantUser, Flow) {
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
        var start = $moment.utc($scope.filters.startDate);
        var end = $moment.utc($scope.filters.endDate);

        var params = vm.filterObject({
          'tenantId': Session.tenant.tenantId,
          'start': start.startOf('day').format(),
          'end': end.endOf('day').format(),
          'resourceId': $scope.filters.resource ? $scope.filters.resource.id : null,
          'flowId': $scope.filters.flow ? $scope.filters.flow.id : null
        }, function(value) {
          return !!value;
        });

        return params;
      };

      vm.searchRecordings = function() {
        var params = vm.massageFilters();
        $scope.recordings = [];
        // These two flags are required because loResourceTable infers a "loading" state based on these properties.
        // Ideally, the loResourceTable would allow you to set a "loading" flag explicitly.
        $scope.recordings.$promise = true;
        $scope.recordings.$resolved = false;
        RealtimeStatisticInteraction.cachedGet(params).$promise.then(function (interactionSearch) {
          if (interactionSearch.interactions === null) {
            // If there aren't any interactions, this will tell loResourceTable that we're no longer "loading"
            // and it will display "No results are found"
            $scope.recordings.$resolved = true;
          }
          angular.forEach(interactionSearch.interactions, function(interaction, idx) {
            Recording.query({
              tenantId: interactionSearch.tenantId,
              interactionId: interaction.id
            }).$promise.then(function(recordings) {
              angular.forEach(recordings, function(recording) {
                recording.$interaction = interaction;
              });
              $scope.recordings = $scope.recordings.concat(recordings);
              // Now that we have at least one result, we can tell loResourceTable that we're no longer "loading"
              // and it will display the results.
              $scope.recordings.$resolved = true;
            });
          });
          $scope.forms.recordingFilterForm.$setUntouched();
          $scope.forms.recordingFilterForm.$setPristine();
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

      $scope.$watchGroup(['filters.startDate', 'filters.endDate'], function(newVal) {
        if ($scope.forms.recordingFilterForm){
          $scope.forms.recordingFilterForm.$setDirty();
        }
      });

      vm.loadTenantUsers();
      vm.loadFlows();

      $scope.tableConfig = recordingsTableConfig;

      $scope.filters = {
        startDate: $moment.utc(),
        endDate: $moment.utc()
      };

      vm.searchRecordings();
    }
  ]);
