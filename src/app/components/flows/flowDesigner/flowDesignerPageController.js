'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'FlowNotationService', 'FlowLibrary', 'readOnly',
    function($scope, flow, notations, data, FlowNotationService, FlowLibrary, readOnly) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;

      FlowLibrary.loadData(notations.data);

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
