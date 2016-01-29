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
        var interactionSearch = RealtimeStatisticInteraction.cachedGet(params);
        
        interactionSearch.$promise.then(function (interactionSearch) {
          $scope.recordings = [];
          var promises = [];
          angular.forEach(interactionSearch.interactions, function(interaction) {
            var recordings = Recording.query({
              tenantId: interactionSearch.tenantId,
              interactionId: interaction.id
            });
            
            promises.push(recordings.$promise.then(function(recordings) {
              angular.forEach(recordings, function(recording) {
                recording.$interaction = interaction;
              });
              return recordings;
            }));
          });
          
          $q.all(promises).then(function(promiseValues) {
            angular.forEach(promiseValues, function(recordings) {
              Array.prototype.push.apply($scope.recordings, recordings);
            });
            $scope.forms.recordingFilterForm.$setUntouched();
            $scope.forms.recordingFilterForm.$setPristine();
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