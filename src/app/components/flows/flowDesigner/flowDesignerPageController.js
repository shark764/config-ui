'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'version', 'media', 'queue', 'FlowNotationService',
    function($scope, flow, version, media, queue, FlowNotationService) {
      $scope.flow = flow;
      $scope.version = version;

      KeyboardJS.on('backspace', function(event) {
        event.preventDefault();
      });

      FlowNotationService.media = media;
      FlowNotationService.queue = queue;
    }
  ]);
