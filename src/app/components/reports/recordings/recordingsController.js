'use strict';

angular.module('liveopsConfigPanel')
  .controller('RecordingsController', ['$scope', 'Recording', 'Session', 'recordingsTableConfig', 'RealtimeStatisticInteraction',
    function ($scope, Recording, Session, recordingsTableConfig, RealtimeStatisticInteraction) {
      var vm = this;
      vm.fetchInteractions = function () {
        return RealtimeStatisticInteraction.get({
          tenantId: '308878f0-a2c7-11e5-a0ce-c1ae7ae4ed37',
          start: '2016-01-07T00:00:00.000Z',
          end: '2016-01-07T23:59:59.999Z'
        });
      };
      
      vm.loadRecordings = function() {
        $scope.recordings = [];
        
        var interactionSearch = vm.fetchInteractions();
        
        interactionSearch.$promise.then(function (interactionSearch) {
          angular.forEach(interactionSearch.interactions, function(interaction) {
            Recording.query({
              tenantId: '308878f0-a2c7-11e5-a0ce-c1ae7ae4ed37',
              interactionId: interaction.id
            }).$promise.then(function(recordings) {
              angular.forEach(recordings, function(recording) {
                recording.$interaction = interaction;
                $scope.recordings.push(recording);
              });
            });
          });
        });
      };
      
      vm.play = function() {
        var audioElem = angular.element('#recording-audio')[0];
        audioElem.play();
      };
      
      vm.pause = function() {
        var audioElem = angular.element('#recording-audio')[0];
        audioElem.pause();
      };
      
      vm.loadRecordings();
      $scope.tableConfig = recordingsTableConfig;
    }
  ]);