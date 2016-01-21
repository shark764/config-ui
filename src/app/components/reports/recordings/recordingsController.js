'use strict';

angular.module('liveopsConfigPanel')
  .controller('RecordingsController', ['$scope', '$q', '$parse', 'Recording', 'Session', 'recordingsTableConfig', 'RealtimeStatisticInteraction', 'TenantUser', 'Flow',
    function ($scope, $q, $parse, Recording, Session, recordingsTableConfig, RealtimeStatisticInteraction, TenantUser, Flow) {
      var vm = this;
      
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
        var params = vm.filterObject({
          'tenantId': '308878f0-a2c7-11e5-a0ce-c1ae7ae4ed37',
          'start': '2016-01-14T00:00:00.000Z',
          'end': '2016-01-14T23:59:59.000Z',
          'resource-id': $scope.filters.resource ? $scope.filters.resource.id : null,
          'flow-id': $scope.filters.flow ? $scope.filters.flow.id : null
        }, function(value) {
          return !!value;
        });
        
        //TODO: DO SOMETHING WITH DATES
        
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
              // tenantId: '308878f0-a2c7-11e5-a0ce-c1ae7ae4ed37',
              // interactionId: '9066db20-baf2-11e5-97cb-c1ae7ae4ed37'
            });
            
            promises.push(recordings.$promise.then(function(recordings) {
              angular.forEach(recordings, function(recording) {
                // recording.$interaction = interactionSearch.interactions[0];
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
      
      vm.loadTenantUsers();
      vm.loadFlows();
      
      $scope.tableConfig = recordingsTableConfig;
      $scope.filters = {};
      $scope.forms = {};
      
      vm.searchRecordings();
    }
  ]);