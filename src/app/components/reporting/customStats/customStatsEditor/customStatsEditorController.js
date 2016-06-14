'use strict';

angular.module('liveopsConfigPanel')
.controller('customStatsEditorController', ['$scope', '$timeout', '$state', 'FullscreenService', 'TableMiddlewareService',
  function($scope, $timeout, $state, FullscreenService, TableMiddlewareService) {
    
    $scope.toggleFullscreen = FullscreenService.toggleFullscreen;

    $scope.editorHTML = {
      lineNumbers: true,
      indentUnit: 2,
      smartIndent: true,
      tabSize: 2,
      mode: "clojure",
      theme: "mdn-like",
      keyMap: "sublime",
      lint: true,
      scrollbarStyle: "null",
      matchBrackets: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      indentWithTabs: false
    };

    $scope.code = "";
  }
]);
