'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'FlowNotationService', 'FlowLibrary', 'readOnly',
    function($scope, flow, notations, data, FlowNotationService, FlowLibrary, readOnly) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;

      if(flow.type === 'customer' || flow.type === 'reusable'){
        FlowNotationService.setLastParticipant('titan/customer');
      }

      var parsedNotations = FlowLibrary.parseNotations(notations);

      $scope.notations = parsedNotations;

      FlowLibrary.loadData(parsedNotations);

      $scope.$on('$destroy', function() {
        var designerKeys = [
          'delete',
          'super',
          'ctrl',
          'backspace',
          'z',
          'y',
          'c',
          'v',
          '=',
          '-'
        ];

        //Unbind Flow Designer keys
        designerKeys.forEach(function(key) { KeyboardJS.clear(key); });
      });
    }
  ]);
