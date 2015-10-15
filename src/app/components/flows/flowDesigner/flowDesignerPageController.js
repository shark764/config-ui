'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'media', 'queue', 'FlowNotationService', 'FlowPaletteService', 'readOnly',
    function($scope, flow, notations, data, media, queue, FlowNotationService, FlowPaletteService, readOnly) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;
      $scope.online = true;

      $scope.notations = notations.data;

      FlowPaletteService.loadData(notations.data);

      FlowNotationService.media = media;
      FlowNotationService.queue = queue;

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
