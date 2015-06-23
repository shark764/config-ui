'use strict';

angular.module('liveopsConfigPanel')
  .controller('SubflowDesignerPageController', ['$scope', 'subflow',
    function($scope, subflow) {
      $scope.subflow = subflow;
    }
  ]);