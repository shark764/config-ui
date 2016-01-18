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
          tenantId: Session.tenant.tenantId,
          startDate: $scope.filters.startDate,
          endDate: $scope.filters.endDate,
          resourceId: $scope.filters.resourceId
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
          // angular.forEach(interactionSearch.interactions, function(interaction) {
            var recordings = Recording.query({
              // tenantId: interactionSearch['tenant-id'],
              // interactionId: interaction.id
              tenantId: '308878f0-a2c7-11e5-a0ce-c1ae7ae4ed37',
              interactionId: '9066db20-baf2-11e5-97cb-c1ae7ae4ed37'
            });
            
            promises.push(recordings.$promise.then(function(recordings) {
              angular.forEach(recordings, function(recording) {
                recording.$interaction = interactionSearch.interactions[0];
                // recording.$interaction = interaction;
              });
              return recordings;
            }));
          // });
          
          $q.all(promises).then(function(promiseValues) {
            var allRecordings = [];
            angular.forEach(promiseValues, function(recordings) {
              Array.prototype.push.apply(allRecordings, recordings);
            });
            
            $scope.recordings = vm.postSearchFilter(allRecordings);
          });
        });
      };
      
      vm.postSearchFilter = function(recordings) {
        var filtered = recordings.filter(vm.extensionFilter);
        return filtered.filter(vm.flowFilter);
      };
      
      vm.extensionFilter = function(recording) {
        if(!$scope.filters.extension) {
          return true;
        }
        
        var include = false;
        angular.forEach(recording.participants, function(participant) {
          include = include || participant.extension.indexOf($scope.filters.extension) > -1;
        });
        return include;
      };
      
      vm.flowFilter = function(recording) {
        return $scope.filters.flowId ?
          recording.flowId === $scope.filters.flowId :
          true;
      };
      
      vm.submit = function() {
        return $scope.selectedRecording.save();
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
      
      vm.onFilterAgentSelect = function(tenantUser) {
        if(tenantUser) {
          $scope.filters.resourceId = tenantUser.id;
        }
      };
      
      vm.onFlowSelect = function(flow) {
        if(flow) {
          $scope.filters.flowId = flow.id;
        }
      };
      
      vm.loadTenantUsers();
      vm.loadFlows();
      
      $scope.tableConfig = recordingsTableConfig;
      $scope.filters = {};
      
      vm.searchRecordings();
    }
  ]);