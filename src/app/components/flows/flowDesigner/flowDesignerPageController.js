'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'version', 'media', 'queue', 'FlowNotationService', 'FlowPaletteService',
    function($scope, flow, notations, version, media, queue, FlowNotationService, FlowPaletteService) {
      $scope.flow = flow;
      $scope.version = version;

      KeyboardJS.on('backspace', function(event) {
        if ($('input:focus').length > 0) { return; }
        event.preventDefault();
      });

      FlowPaletteService.loadData(notations.data);

      FlowNotationService.media = media;
      FlowNotationService.queue = queue;
      FlowNotationService.notationMocks = notations.data;
    }
  ]);
