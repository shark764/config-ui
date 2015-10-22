'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'FlowNotationService', 'FlowPaletteService', 'readOnly',
    function($scope, flow, notations, data, FlowNotationService, FlowPaletteService, readOnly) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;

      $scope.notations = notations.data;

      FlowPaletteService.loadData(notations.data);

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
