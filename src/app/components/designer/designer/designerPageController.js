'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'version', 'media', 'queue', 'FlowNotationService',
    function($scope, flow, version, media, queue, FlowNotationService) {
      $scope.flow = flow;
      $scope.version = version;

      FlowNotationService.media = media;
      FlowNotationService.queue = queue;
    }
  ]);
