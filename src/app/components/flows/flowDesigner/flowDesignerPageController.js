'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'notations', 'draft', 'media', 'queue', 'FlowNotationService', 'FlowPaletteService',
    function($scope, flow, notations, draft, media, queue, FlowNotationService, FlowPaletteService) {
      $scope.flow = flow;
      $scope.draft = draft;

      $scope.notations = notations.data;

      FlowPaletteService.loadData(notations.data);

      FlowNotationService.media = media;
      FlowNotationService.queue = queue;
    }
  ]);
