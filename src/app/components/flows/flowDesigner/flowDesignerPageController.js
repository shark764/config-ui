'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'version', 'media', 'queue', 'FlowNotationService', 'FlowPaletteService',
    function($scope, flow, notations, version, media, queue, FlowNotationService, FlowPaletteService) {
      $scope.flow = flow;
      $scope.version = version;

      FlowPaletteService.loadData(notations.data);

      FlowNotationService.media = media;
      FlowNotationService.queue = queue;
      FlowNotationService.notationMocks = notations.data;
    }
  ]);
