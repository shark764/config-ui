'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'data', 'media', 'queue', 'FlowNotationService', 'FlowPaletteService', 'readOnly', 'FlowLibrary',
    function($scope, flow, notations, data, media, queue, FlowNotationService, FlowPaletteService, readOnly, FlowLibrary) {
      $scope.flow = flow;
      $scope.flowData = data;
      $scope.readOnly = readOnly;

      var parsedNotations = FlowLibrary.parseNotations(notations);

      $scope.notations = parsedNotations;
      FlowPaletteService.loadData(parsedNotations);

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
