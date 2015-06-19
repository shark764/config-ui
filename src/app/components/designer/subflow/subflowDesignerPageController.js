'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'SubflowCommunicationService', 'subflow',
    function($scope, SubflowCommunicationService, subflow) {
      $scope.subflow = subflow;
      $scope.save = function() {
        SubflowCommunicationService.addSubflow();
      };
    }
  ]);