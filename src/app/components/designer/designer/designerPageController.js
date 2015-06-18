'use strict';

angular.module('liveopsConfigPanel')
  .controller('DesignerPageController', ['$scope', 'flow', 'version',
    function($scope, flow, version) {
      $scope.flow = flow;
      $scope.version = version;
    }
  ]);